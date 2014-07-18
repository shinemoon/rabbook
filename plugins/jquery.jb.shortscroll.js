/*
 * ShortScroll - jQuery UI Widget 
 * Copyright (c) 2010 Jesse Baird
 *
 * http://jebaird.com/blog/shortscroll-jquery-ui-google-wave-style-scroll-bar
 *
 * Depends:
 *   - jQuery 1.4
 *   - jQuery UI 1.8 (core, widget factory)
 *   - jQuery mousewheel plugin - Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 *  
 *
 *
*/
(function($) {
    
    jQuery.event.special.jbShortscrollUpdateMarker = {
        setup: function(data, namespaces) {
            var elem = this, $elem = jQuery(elem);
            $elem.bind('scroll', jQuery.event.special.jbShortscrollUpdateMarker.handler);
        },
    
        teardown: function(namespaces) {
            var elem = this, $elem = jQuery(elem);
            $elem.unbind('scroll', jQuery.event.special.jbShortscrollUpdateMarker.handler);
        },
    
        handler: function(event) {
           // console.log(event);
            var elem = this,
            scrollHeight = this.scrollHeight,
            scrollTop = this.scrollTop,
            $elem = $(elem), 
            viewPort = $elem.innerHeight(),
            $marker = $elem.data('jb-shortscroll-marker');
            
            markerIncrament=Math.ceil(scrollTop /(((scrollHeight-viewPort)/(viewPort/2-$marker.outerHeight()))));
            $marker.css('top',markerIncrament);
            event.type = "jbShortscrollUpdateMarker";
            // let jQuery handle the triggering of "tripleclick" event handlers
            jQuery.event.handle.apply(this, arguments)
    
        }
    };
    
    
    

    $.widget("jb.shortscroll", {
		options: {
			scrollSpeed: 100,
			animationSpeed: 150
		},
				
		_create: function() {
			
			var self = this,
				o = self.options,
				el = self.element,
                
                wrapper = $('<div class="jb-shortscroll-wrapper"><div class="jb-shortscroll-track"><div class="jb-shortscroll-scrollbar"><div class="jb-shortscroll-scrollbar-btn-up jb-shortscroll-scrollbar-btn ui-corner-top" data-dir="up"><span class="ui-icon ui-icon-triangle-1-n"></span></div><div class="jb-shortscroll-scrollbar-middle"></div><div class="jb-shortscroll-scrollbar-btn-down jb-shortscroll-scrollbar-btn ui-corner-bottom" data-dir="down"><span class="ui-icon ui-icon-triangle-1-s"></span></div></div></div><div class="jb-shortscroll-marker ui-corner-all"></div><div class="jb-shortscroll-stopper ui-corner-all"></div></div>').insertAfter(el);
                
            self._viewPort = el.innerHeight();
            
            el
            .attr('tabindex','0')
            .addClass('jb-shortscroll-target')
            .data('jb-shortscroll-marker',wrapper.find('div.jb-shortscroll-marker'))
            .bind({
                'jbShortscrollUpdateMarker.jbss':$.noop,
                'mousewheel.jbss':function(event,delta){
                    var dir = delta > 0 ? 'Up' : 'Down',
                    vel = (dir=='Up')?-Math.abs(delta):Math.abs(delta);
                    this.scrollTop=+this.scrollTop+vel*o.scrollSpeed;
                    //make the target act like it has a navtive scroll bar
                    if( this.scrollTop != 0 && dir == 'Up' || this.scrollTop +self._viewPort != this.scrollHeight && dir=='Down' ){
                        //console.log('up false');
                        return false;
                    }
                        
                }
            });

            self._positionWrapper(wrapper);
            
            wrapper
            .find('div.jb-shortscroll-scrollbar-btn')
            .hover(function(e){
                $(this).toggleClass('ui-state-hover')
            })
            .bind('click',function(e){
                el.animate({
                    'scrollTop':'+='+(($(this).attr('data-dir')=='up')?-self._viewPort:self._viewPort)
                },o.animationSpeed);
            })
            .end()
            .find('div.jb-shortscroll-scrollbar')
            .draggable({
                axis:'y',
                containment:'parent',
                cancel:'.jb-shortscroll-scrollbar-btn',
                cursor:'move',
                start: function(e,ui){
                	//TODO: figure out a way to tirgger this so its now so slow
                    //only trigger if bar and scroll top are faruther apart
       //            el
//                   .stop()
//                   .animate({
//                        scrollTop:self._pixelRatio($(this))*ui.position.top
//                   },250)
                },
                drag: function(e,ui) {
                    var $this = $(this);
                    markerIncrament=self._pixelRatio($this);
                    el[0].scrollTop=markerIncrament*ui.position.top;
               }
            });
            
            $(window).bind('resize',function(){
                self._viewPort = el.innerHeight();
                self._positionWrapper(wrapper);
            });
               
		},
				
		destroy: function() {			
			this.element.next().remove();
            this.element.unbind('jbShortscrollUpdateMarker.jbss mousewheel.jbss');
			//remove wrapper and mouse wheel events
			$(window).unbind("resize");
		},
		
		_setOption: function(option, value) {
			$.Widget.prototype._setOption.apply( this, arguments );
           
		},
        /*
            get the ratic of pixs to the target to scroll track
        */
        _pixelRatio: function(element){
            return Math.ceil((((this.element[0].scrollHeight-this._viewPort)/(this._viewPort/2-element.outerHeight()))));
        },
        _positionWrapper: function(wrapper){
            
            wrapper
            .css({
                position:'absolute',
                top:0,
                left:0,
                height:this._viewPort/2
            })
            .position({
                of:this.element,
                my:'left top',
                at:'right top',
                offset:'-8 0',
                collision:'none'               
            })
        }
        
	});
})(jQuery);
