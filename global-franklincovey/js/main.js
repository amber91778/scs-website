jQuery(function ($) {
  $(function () {
    // Ready
    
    var lazyLoadInstance = new LazyLoad({
    // Your custom settings go here
  });

    $("p:empty").remove();

    addBlacklistClass();
    handleHighlightText();

    if(!jQuery('body').hasClass('legacy-page')){
      scrollElementToView();

      var settings = {
        anchors: "a",
        blacklist: ".wp-link",
        onStart: {
          duration: 400, // ms
          render: function ($container) {
            $container.addClass("slide-out");
          },
        },
        onAfter: function ($container) {
          addBlacklistClass();
          scrollElementToView();

          $container.removeClass("slide-out");
        },
      };

      // Global fade in content
      $(window).scroll(function () {
        scrollElementToView();
      });
    }

    var $journeySlides = jQuery(".uk-slider-items");
    // handle expand bu
    $journeySlides.find(".expand-button").click(function () {
      var $me = jQuery(this);
      var $container = $me.closest(".slide-container");
      var $sliderItems = $me.closest(".uk-slider-items");

      $journeySlides.find(".slide-container").each(function () {
        var $c = jQuery(this);
        if (!$container.is($c)) {
          // remove active
          $c.removeClass("is-active");
        }
      });
      // make current container active.
      $container.addClass("is-active");
      // refresh slider.
      var parentLeft = $sliderItems.position().left;
      var containerPos = $container.position().left;
      var slideViewWidth = $me.closest(".uk-slider-container").width();

      //setTimeout(function(){
      var actualLeft = parentLeft + containerPos;
      var containerRight = actualLeft + $container.width();
      // slide content is actually bigger than viewport (of slider to right)
      if (containerRight > slideViewWidth) {
        //var shouldSlideTo = parentLeft - (containerRight - slideViewWidth);
        //$sliderItems.attr('style',"transform: translate3d(" + shouldSlideTo + "px, 0px, 0px)");
        //$sliderItems.translate3d({x:shouldSlideTo,y:0,z:0},500,'ease-out');
        jQuery("#journey-next-button i").trigger("click");
      }

      // content not viewable left.
      if (actualLeft < 0) {
        jQuery("#journey-prev-button i").trigger("click");
      }

      //},1000);
    });

    // handle collapse button
    $journeySlides.find(".collapse-button").click(function () {
      var $me = jQuery(this);
      var $container = $me.closest(".slide-container");
      // remove active class from container
      var counter = 0;
      var slides = $journeySlides.find(".slide-container");
      var totalSlides = slides.length;
      var theLastOne = 0;
      slides.each(function () {
        var $c = jQuery(this);
        if (!$container.is($c)) {
          // remove active
          $c.removeClass("is-active"); 
        }else{
          if(counter == (totalSlides -1 )){
            //theLastOne = 1000;
            console.log("is the last one");
            var contWidth = $journeySlides.parent().width();
            var inView = Math.floor(contWidth / 279);
            if(inView < totalSlides){
              UIkit.slider('#journey-block').show(totalSlides - inView);
            }else{
              UIkit.slider('#journey-block').show(1);
            }
          }
        }
        counter ++;
      });
      setTimeout(function(){
        $container.removeClass("is-active")
      },theLastOne);
    });
  });

  function handleHighlightText() {
    $(".highlight-text")
      .mouseover(function () {
        var $me = $(this);
        var image = $me.data("media");
        if (image) {
          $("#highlight-text-image")
            .css("background-image", "url(" + image + ")")
            .show();
        }
      })
      .mouseleave(function () {
        var $me = $(this);
        var image = $me.data("media");
        if (image) {
          $("#highlight-text-image").hide().css("background-image", "none");
        }
      });
  }

  function addBlacklistClass() {
    $("a").each(function () {
      if (
        this.href.indexOf("/wp-admin/") !== -1 ||
        this.href.indexOf("/wp-login.php") !== -1
      ) {
        $(this).addClass("wp-link");
      }
    });
  }

  function scrollElementToView() {
    /*  Check the location of each desired element */
/*    $(
      'div[class*="wp-block-"], section.block, .footer .uk-grid, hr[class*="wp-block-"], h2'
    ).each(function (i) {
      var offset = 0;
      var top_of_object = $(this).position().top + offset;
      var bottom_of_window = $(window).scrollTop() + $(window).height();

      If the object is completely visible in the window, fade it it
      if (bottom_of_window > top_of_object) {
        $(this).addClass("animated");
      }
    });*/
    $(".bw-to-color").each(function () {
      var $me = $(this);
      var offset = 400;
      var objectTop = $me.offset().top - $(window).scrollTop();
      var windowSize = $(window).height();

      var bottomRange = windowSize - offset;
      var topRange = -($me.height() - offset);

      var viewFinderBottom = $(window).scrollTop() + $(window).height();

      if (objectTop > topRange && objectTop < bottomRange) {
        $me.addClass("in-color");
      } else {
        $me.removeClass("in-color");
      }
    });

    /* Fade in lines */
    $(".animated-line").each(function (i) {
      var offset = 0;
      var top_of_object = $(this).position().top - offset;
      var bottom_of_window = $(window).scrollTop() + $(window).height();

      /* If the object is completely visible in the window, fade it it */
      if (bottom_of_window > top_of_object) {
        $(this).addClass("animated");
      }
    });
  }

  var link = $("#navbar a.dot");

  // Move to specific section when click on menu link
  link.on("click", function (e) {
    var target = $($(this).attr("href"));
    $("html, body").animate(
      {
        scrollTop: target.offset().top,
      },
      600
    );
    $(this).addClass("active");
    e.preventDefault();
  });

  // Run the scrNav when scroll
  $(window).on("scroll", function () {
    scrNav();
  });

  // scrNav function
  // Change active dot according to the active section in the window
  function scrNav() {
    var sTop = $(window).scrollTop();
    $(".sticky-section").each(function () {
      var id = $(this).attr("id"),
        offset = $(this).offset().top - 100,
        height = $(this).height();
      if (sTop >= offset && sTop < offset + height) {
        link.removeClass("active");
        $("#navbar")
          .find('[data-scroll="' + id + '"]')
          .addClass("active");
      }
    });
  }
  scrNav();

  // Customer Stories handler
  $(".block-customer-stories .item .plus").click(function (e) {
    e.preventDefault();
    var $current = $(this).closest(".item");
    if ($current.hasClass("active")) {
      $current.removeClass("active");
      $current.find(".optional-cta").removeAttr("tabindex");
      $current.closest(".accordion").removeClass("has-expanded");
      return;
    }
    $current.addClass("active");
    $current.find(".optional-cta").removeAttr("tabindex");
    $current
      .siblings()
      .removeClass("active")
      .find(".optional-cta")
      .attr("tabindex", "-1");

    $current.closest(".accordion").addClass("has-expanded");
  });

  $(".counter").counterUp({
    delay: 20,
    time: 1000,
  });

  $("#search_icon").click(function (e) {
    e.preventDefault();
    $("body").toggleClass("searching");
    $("#search_field").focus();
  });

  $("#close_search").click(function (e) {
    e.preventDefault();
    $("body").toggleClass("searching");
    $("#search_field").blur();
  });

  var $whatsNewBlock = jQuery(".block-whats-new").first();

  $whatsNewBlock.find(".toggle-link").mouseover(function(){
    var $me = jQuery(this);
    if($me.hasClass('is-active')) return;
    $whatsNewBlock.find('img.is-active,a.is-active').removeClass('is-active');
    $whatsNewBlock.find("#wn_image-" + $me.attr('data-index')).addClass('is-active');
    $me.addClass('is-active');
  });

  window.onscroll = function() {fc_onScroll()};

  function fc_onScroll() {
    var body = document.getElementById("body-element");
    if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
      if(!body.classList.contains('sticky-nav')){
        body.classList.add('pre-sticky');
        setTimeout(function(){
          body.classList.add('sticky-nav');
          var educationMenu = document.getElementById('education-menu');
          if(educationMenu != null){
            setTimeout(function(){
              educationMenu.classList.add('show-text');
            },300);
          }
        },100);
      }
    } else {
      if(body.classList.contains('sticky-nav')){
        body.classList.remove('pre-sticky');
        body.classList.remove('sticky-nav');
        var educationMenu = document.getElementById('education-menu');
        if(educationMenu != null){
          educationMenu.classList.remove('show-text');
        }
      }
    }
  }
  fc_onScroll();
});