/**
 * dude theme JavaScript.
 */

( function( $ ) {

  // Activate submit button when all fields filled out in comments section
  $('#commentform textarea#comment, #commentform input#author, #commentform input#email').on('keyup', function() {
      if( $(this).val() != '' ) {
          $('#commentform input#submit').removeClass('active');
      } else {
          $('#commentform input#submit').removeClass('active');
      }
  });

  $('#commentform textarea#comment, #commentform input#author, #commentform input#email').on('change', function() {
        if( $(this).val() != '' ) {
            $('#commentform input#submit').addClass('active');
        } else {
            $('#commentform input#submit').removeClass('active');
        }
  });

  // Do stuff when scrolling to a certain point
	$(window).scroll(function() {

    // Fixed navigation in certain point
    if (!$('.site-header').hasClass("sticky")) {
      if( $(this).scrollTop() >= $('.site-content').offset().top +20 ) {
        $(".site-header").addClass('fixed');
        $(".site-header").removeClass('deactivated');
      } else {
        $(".site-header").removeClass('fixed');
        $(".site-header").addClass('deactivated');
      }
    }

    // Hide after certain amount
    if( '.scroll-down' != undefined) {

      var scroll = $(window).scrollTop();
      if (scroll >= 200) {
        $(".scroll-down").addClass("fadeout");
      } else {
        $(".scroll-down").removeClass("fadeout");
      }

    }
	});

  $(function() {

    // Prevent 100vh blocks from "jumping" when browsing on mobile and address bar goes hidden
    function greedyJumbotron() {
        var HEIGHT_CHANGE_TOLERANCE = 100; // Approximately URL bar height in Chrome on tablet

        var jumbotron = $(this);
        var viewportHeight = $(window).height();

        $(window).resize(function () {
            if (Math.abs(viewportHeight - $(window).height()) > HEIGHT_CHANGE_TOLERANCE) {
                viewportHeight = $(window).height();
                update();
            }
        });

        function update() {
            jumbotron.css('height', viewportHeight + 'px');
        }

        update();
    }

    $('.block-front-page, .block-hero-contributions').each(greedyJumbotron);

    // Allow adding regular url in comment form without having to type http
    if( $('input#url').length ) {
      $("input#url").keydown(function() {
        if (!/^http:\/\//.test(this.value)) {
          this.value = "http://" + this.value;
        }
      });
    }

    // Auto expanding textarea
    autosize( $('textarea') );

    // On click to scroll down arrow
    $(".scroll-down a").click(function(e) {
    	e.preventDefault();

        $('html, body').animate({
            scrollTop: $(".scroll-down-anchor").offset().top -50
        }, 1000);
    });

    // Open chat
    $('.start-chat').on('click', function(event) {
      event.preventDefault();
      $crisp.do('chat:open');
    });

    // Close chat when pressing esc and set focus to chat button to improve accessibility
    $(document).keyup(function(e) {
      if (e.keyCode === 27) {
        $crisp.do('chat:close');
        $('.button-nav.start-chat').focus();
      }
    });

    // Smooth scroll to top
  	$('.top').on('click', function(event) {
  		event.preventDefault();

      $( this ).addClass('launched');

      setTimeout(function() {
        $('.top').removeClass('launched');
      }, 1500);

  		$('body, html').animate({
  			scrollTop: 0,
  		 	}, 700
  		);
  	});

  });

  // Last drunk coffee time formatting
  moment.locale( 'fi' );
  if( $('.coffee-text > span').text() !== '0' ) {
    var time = $('.coffee-time').data('time');
    var timeago = moment( time ).fromNow();
    $('.coffee-time span').html( timeago );
  }

  // Crisp notifications
  if( $('body').hasClass('home') || $('body').hasClass('single-service') ) {
	  if( Cookies.get( 'crisp_greeting_sent' ) == null ) {
			TimeMe.initialize({
				currentPageName: '<?php the_title() ?>',
				idleTimeoutInSeconds: 10
			});

			TimeMe.callAfterTimeElapsedInSeconds(30, function() {
				if( ! $crisp.is("session:ongoing") && $(window).width() > 560 ) {
					if( $('body').hasClass('home') ) {
						// $crisp.push(["do", "message:show", ["text", "Moro! Etsitkö vähän erilaista digitoimistoa seuraavaan projektiisi? Heitä viestiä jos voidaan auttaa :)"]]);
					} else if ( $('body').hasClass('postid-1989') ) {
						$crisp.push(["do", "message:show", ["text", "Moro! Täällä olisi osaavat kädet valmiina vastaamaan, jos sulla on kysyttävää verkkosivuista tai WordPressistä."]]);
					} else if ( $('body').hasClass('postid-1990') ) {
						$crisp.push(["do", "message:show", ["text", "Moro! Tehtäiskö kummallekin toimivaa kauppaa?"]]);
					}

					// $crisp.push(["do", "chat:open"])
					Cookies.set( 'crisp_greeting_sent', 'true', { expires: 3650 } );
				}
			});
		}
	}

  // Poll if new coffee is being drunk while on page
  function askForCoffee() {
    jQuery.ajax({
      method: 'GET',
      url: 'https://coffter.dude.fi/v1/coffee/drunk/week',
      crossDomain: true,
      dataType: 'jsonp',
    }).done( function( response ) {

      if( response.length !== 0 && response !== false ) {        

        if( response.details.latest_entry ) {
          var timeago = moment( response.details.latest_entry ).fromNow();
          $('.coffee-text span').html( response.details.count );
          $('.coffee-time span').html( timeago );                 

          // Define current time
          var currentdate = new Date(); 
          var datetime = 
          currentdate.getFullYear() + "-"
          + (currentdate.getMonth()+1)  + "-" 
          + currentdate.getDate() + " "  
          + currentdate.getHours() + ":"  
          + currentdate.getMinutes() + ":" 
          + currentdate.getSeconds();

          // Convert to unix time
          var timestamp = ( moment(datetime).unix() );
          var entrytime = ( moment(response.details.latest_entry).unix() );

          var datediff = timestamp - entrytime;

          if( datediff < 7 ) {

              // Send a notification if coffee drunk
              var notif = $.notify_osd.create({
                'text'         : '<span>Reaaliaikainen ilmoitus</span> Toimistolla juotiin juuri kupillinen kahvia! ' + response.details.count + ' kuppia juotu tällä viikolla.',
                'sticky'       : false,
                'timeout'      : 10,
                'dismissable'  : true,
                'visible_max'  : 1
              });
            }

        }
      }
    }).always( function() {
      setTimeout( askForCoffee, 7000 );
    });
  }

  setTimeout( askForCoffee, 7000 );

  var delay = (function(){
    var timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();

} )( jQuery );

function check_user_likes( target_class ) {
  jQuery.each( jQuery(target_class), function() {
    var user_likes = JSON.parse( localStorage.getItem( 'dude_liked_posts' ) );
    if( user_likes === null ) {
      user_likes = [];
    }

    var post_id = jQuery(this).attr('id');
    if( post_id !== undefined ) {
      post_id = post_id.substr( post_id.indexOf( "-" ) + 1 );

      if( jQuery.inArray( parseInt( post_id ), user_likes ) > -1 ) {
        jQuery(this).find('.likes').addClass('liked');
      }
    }
  });
}

function isScrolledIntoView(elem) {
	var docViewTop = jQuery(window).scrollTop();
	var docViewBottom = docViewTop + jQuery(window).height();

	var elemTop = jQuery(elem).offset().top;
	var elemBottom = elemTop + jQuery(elem).height();

	return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

check_user_likes( 'article.post' );
