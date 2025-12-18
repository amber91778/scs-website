jQuery(function ($) {
  
  /**
   * search the course list for a specific topic
   */
  var $podcastSearch = jQuery("#podcast-search");
  if($podcastSearch.length > 0){
    $podcastSearch.on( "submit", function(e) {
      e.preventDefault();
      fc_searchPodcast(false);
    } );
    // clear search
    var $block = $podcastSearch.closest("section.block");
    $block.find("#clear-search").on('click',function(e){
      e.preventDefault();
      fc_resetPodcastSearch();
    });
    fc_searchPodcast(true);
    // auto search when user selects filters
    var $topicDropdown = $podcastSearch.find("#topic-dropdown");
    if($topicDropdown.length > 0){
      $topicDropdown.find("input").change(function(){
        fc_searchPodcast(false);
      });
    }
  }

  /**
   * ajax call to search course items for a specific series.
   * @return {[type]} [description]
   */
  function fc_searchPodcast(init){
    var $term = $podcastSearch.find("#podcast-query");
    var topics = [];
    var $topicDropdown = $podcastSearch.find("#topic-dropdown");
    if($topicDropdown.length > 0){
      topics = $topicDropdown.find("input:checked");
    }
    if(($term.val().length === 0 && topics.length === 0) && !init){
      fc_resetPodcastSearch();
      return;
    }
    jQuery.ajax({
        type: "post",
        dataType: "json",
        url: ajax_object.ajax_url,
        data: $podcastSearch.serialize(),
        success: function(response){
          fc_handlePodcastSearchResults(response,init);
        }
    });
  }

  /**
   * reset search but assigning correct block classes
   * hide/clear results and show seasons
   * @return {[type]} [description]
   */
  function fc_resetPodcastSearch(){
    var $term = $podcastSearch.find("#podcast-query");
    var $block = $podcastSearch.closest("section.block");
    $term.val("");
    $block.find("#block-header").show();
    $block.find("#block-header-search").hide();
    $topicDropdown = $podcastSearch.find("#topic-dropdown");
    if($topicDropdown.length > 0){
      $topicDropdown.find("input:checked").prop("checked",false);
    }
    fc_searchPodcast(true);
  }

  /**
   * build results on the page.
   * @param  {[type]} results [description]
   * @return {[type]}         [description]
   */
  function fc_handlePodcastSearchResults(results,init){
    var $block = $podcastSearch.closest("section.block");
    var $results = $block.find('.search-results');
    var collapsed = $podcastSearch.data('collapsed');
    if(!init){
      $block.find("#block-header").hide();
      $block.find("#block-header-search").show();
    }
    $results.html(results);
    if(collapsed){
      $results.find(".toggle-view").click(function(e){
        e.preventDefault();
        var $me = jQuery(this);
        var $block = $me.closest(".course");
        if($block.hasClass('collapsed')){
          $block.addClass('expanded').removeClass('collapsed');
        }else{
          $block.addClass('collapsed').removeClass('expanded');
        }
      });
    }
  }
});