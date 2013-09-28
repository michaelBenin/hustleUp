/*
HustleUp 1.0.0
Author: James Thomas - jimmy@happyhustle.com
Copyright (c) 2013 HappyHustle LLC - http://happyhustle.com
Released under Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)
License Info: http://creativecommons.org/licenses/by-sa/3.0/
*/
(function($)
{
    
    var methods = {
        init: function( options )
        {
            if( !window.File || !window.FileReader )
            {
                alert( "Your browser cannot upload from this page. Please upgrade to the latest version of your browser." );
            }

            var settings = $.extend({
                'id'                    : false,                    // ID string for this instance. Randomly generated if not set explicitly. Not an HTML id attribute.
                'btnClass'              : 'btn',                    // Additional CSS classes to add to the bootstrap button
                'btnText'               : 'Upload',
                'btnWidth'              : '73px',                   // Total width of the button with your text, including padding etc
                'btnHeight'             : '36px',                   // Total height of the button with your text, including padding
                'uploadOnFileSelect'    : true,                     // Auto-uploads as soon as a file(s) is selected
                'uploadTarget'          : 'youruploadscript',       // The script to send the upload to. Include full URL if on another domain.
                'multiple'              : true,                     // Allow multiple files to be uploaded at once?

                // PROGRESS BARS
                'progress_show'         : true,                     // Show progress bars?
                'progress_selector'     : '#hh_progress_wrap',      // The html element to attach the progress bars too
                'progress_style'        : 'random',                 // The style of bootstrap progress bar to use. 'random' chooses between all.

                // AUTO DETECTED
                'cors'                  : false                     // Whether or not we're going cross-domain
            }, options );

            var ajax_deferred = [];

            var generate_id = function( len )
            {
                var text = '';
                var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

                for( var i=0; i < len; i++ )
                {
                    text += possible.charAt( Math.floor( Math.random() * possible.length ));
                }

                return text;
            };

            // Events
            var _onChange = function( e )
            {
                var files = e.target.files;

                var xhr_function = function( file_id )
                {
                    return function()
                    {
                        xhr = $.ajaxSettings.xhr();
                        
                        if( xhr.upload )
                        {
                            if( settings.progress_show )
                            {
                                xhr.upload.file_id = file_id;
                                xhr.upload.addEventListener( 'progress', function( e )
                                {
                                    if( e.lengthComputable )
                                    {
                                        var percentComplete = ( e.loaded / e.total ) * 100;
                        
                                        $( '#hh_' + e.target.file_id + ' .progress-bar' ).css( 'width', percentComplete + '%' );
                                    }
                                }, false );
                            }
                        }
                        
                        return xhr;
                    };
                };

                for( var i = 0; i < files.length; i++ )
                {
                    var form_data = new FormData();

                    f = files[ i ];
                    var file_id = 'file_' + i;
                    form_data.append( 'filedata', f );

                    if( settings.progress_show )
                    {
                        progress_style = settings.progress_style;

                        if( progress_style == 'random' )
                        {
                            styles = [ 'progress-bar-info', 'progress-bar-success', 'progress-bar-warning', 'progress-bar-danger' ];
                            progress_style = 'progress-' + styles[Math.floor(Math.random()*styles.length)];
                        }
                    
                        $( '<div id="hh_' + file_id + '" class="well hh_progress"><div class="progress progress-striped active"><div class="progress-bar ' + progress_style + '" role="progressbar" style="width: 0;"></div></div><span class="file_name">' + f.name + '</span></div>' ).appendTo( $( settings.progress_selector ));
                    }

                    var ajax_options = {
                        url: settings.uploadTarget,
                        dataType: 'json',
                        data: form_data,
                        file_id: file_id,
                        cache: false,
                        contentType: false,
                        processData: false,
                        type: 'POST',
                        success: function(data)
                        {
                            if( settings.progress_show )
                            {
                                $progress = $( '#hh_' + file_id );

                                setTimeout( function()
                                {
                                    $progress.fadeOut( 750 );
                                }, 1000 );

                                setTimeout( function()
                                {
                                    $progress.remove();
                                }, 1750 );
                            }

                            if( !data.success )
                            {
                                alert( data.msg );
                            }
                            else
                            {
                                
                            }
                        },
                        error: function( jqXHR, textStatus, errorThrown )
                        {
                            alert( 'An upload error has occured: ' + textStatus );
                            //TODO remove this
                            //console.log( jqXHR );
                            //console.log( errorThrown );
                        },
                        xhr: xhr_function( file_id )
                    };
    
                    if( settings.cors )
                    {
                        ajax_options.xhrFields = {
                            withCredentials: true
                        };
    
                        ajax_options.crossDomain = true;
                    }

                    ajax_deferred.push( ajax_options );
                }

                ajax_deferred_call();
            };

            var ajax_deferred_call = function()
            {
                if( ajax_deferred.length > 0 )
                {
                    ajax_options = ajax_deferred.shift();
                    $.ajax( ajax_options );

                    return true;
                }
                else
                {
                    return false;
                }
            };

            return this.each( function()
            {
                // Random ID string
                if( !settings.id )
                {
                    settings.id = 'hh_hustleup_' + generate_id( 5 );
                }

                // CORS detection
                var tmpTarget = document.createElement( 'a' );
                tmpTarget.href = settings.uploadTarget;

                if( location.hostname.toLowerCase() != tmpTarget.hostname.toLowerCase() )
                {
                    settings.cors = true;
                }

                // Drop the wrapper in place of the target
                var $target = $(this);
                $target.attr( 'multiple', 'multiple' );
                $target.replaceWith( '<div id="' + settings.id + '" class="hh_hustleup clearfix"></div>' );

                $wrapper = $( '#' + settings.id );
                $wrapper.html( '<input type="file"><button type="button" class="' + settings.btnClass + '">' + settings.btnText + '</button>' );
                $wrapper.css({
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'block',
                    width: settings.btnWidth,
                    height: settings.btnHeight
                });

                $input = $( 'input', $wrapper );
                $input.css({
                    opacity: '0',
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    lineHeight: '36px',
                    height: '36px',
                    fontSize: '25px',
                    zIndex: 1,
                    display: 'block',
                    cursor: 'pointer'
                });

                if( settings.multiple )
                {
                    $input.attr( 'multiple', 'multiple' );
                }

                $btn = $( 'button', $wrapper );
                $btn.css({
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                    zIndex: 0
                });

                // We have to fake the hover state, but bootstrap only has .active, so use that.
                $input.bind( 'mouseenter', function(){ $btn.addClass( 'active' ); });
                $input.bind( 'mouseleave', function(){ $btn.removeClass( 'active' ); });

                $input.bind( 'change', _onChange );
            });
        },
    };

    $.fn.hustleUp = function( method )
    {
        // Method calling logic
        if( methods[ method ])
        {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        }
        else if( typeof method === 'object' || ! method )
        {
            return methods.init.apply( this, arguments );
        }
        else
        {
            $.error( 'Method ' +  method + ' does not exist on jQuery.hustleUp' );
        } 
    };
})( jQuery );
