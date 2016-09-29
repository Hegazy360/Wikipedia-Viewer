$(document).ready(function() {
  var searchTerm;
  $(".search").focus();
  var imgSrc = 'https://cdn1.tnwcdn.com/wp-content/blogs.dir/1/files/2014/12/Wikipedia.jpg';
  var img = new Image();
  img.onload = function() {
    $(".image-banner").css("background-image", "url('" + img.src + "')").hide().fadeIn(2000);
  };
  img.src = imgSrc;
  $('.search').keyup(function(event) {
    if (event.keyCode == 13) {
      $(".btn-search").click();
    }
  });
  $(".btn-search").click(function() {
    $(".iframe-container.random:not(.hidden)").addClass("hidden");
    searchTerm = $(".search").val();
    if ($.trim(searchTerm) == '') {
      $(".search,.btn-search").css("border-color", "#D50000");
    } else {
      $(".search,.btn-search").css("border-color", "#CCCCCC");
      getArticles();
    }
  });
  $(".random-link").click(function() {
    $(".iframe-container:not(.random):not(.hidden)").addClass("hidden");
    $(".iframe-container.random").removeClass("hidden");
    $(".iframe.random").addClass("hidden");
    $(".loading.random").removeClass("hidden");
    $(".iframe.random").load(function() {
      $(".loading.random").addClass("hidden");
      $(".iframe.random").removeClass("hidden");
    });
  });

  function getArticles() {
    var html = "";
    $(".results-container").text("");
    $.ajax({
      url: 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrsearch=' + searchTerm + '&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max',
      type: 'GET',
      data: {},
      dataType: 'jsonp',
      success: function(data) {
        $(".loading-search").addClass("hidden");
        if (data.query) {
          $.each(data.query.pages, function(name, value) {
            html += '<a href="https://en.m.wikipedia.org/?curid=' + value.pageid + '" target="' + value.pageid + '">';
            html += '<div class="result animated fadeIn closed ' + value.pageid + '">';
            if (value.thumbnail) {
              html += '<img class="thumb animated fadeIn" src="' + value.thumbnail.source + '" alt="' + value.pageimage + '">';
            }
            html += '<h2 class="title">' + value.title + '</h2>';
            html += '<p class="summary">' + value.extract + '</p>';
            html += '</div>';
            html += '</a>';
            html += '<div class="iframe-container hidden ' + value.pageid + '">' +
              '    <iframe src="" class="iframe hidden animated fadeIn ' + value.pageid + '" width="100%" height="350px" name="' + value.pageid + '"></iframe>' +
              '    <div align="center" class="cssload-fond hidden loading ' + value.pageid + '">' +
              '      <div class="cssload-container-general">' +
              '        <div class="cssload-internal">' +
              '          <div class="cssload-ballcolor cssload-ball_1"> </div>' +
              '        </div>' +
              '        <div class="cssload-internal">' +
              '          <div class="cssload-ballcolor cssload-ball_2"> </div>' +
              '        </div>' +
              '        <div class="cssload-internal">' +
              '          <div class="cssload-ballcolor cssload-ball_3"> </div>' +
              '        </div>' +
              '        <div class="cssload-internal">' +
              '          <div class="cssload-ballcolor cssload-ball_4"> </div>' +
              '        </div>' +
              '      </div>' +
              '    </div>' +
              '  </div>';
            $(".results-container").append(html);
            $(".result." + value.pageid).click(function() {
              $(".result." + value.pageid).toggleClass("closed");
              $(".iframe-container:not(." + value.pageid + "):not(.hidden)").addClass("hidden");
              $(".iframe-container." + value.pageid).toggleClass("hidden");
              $(".iframe." + value.pageid).addClass("hidden");
              $(".loading." + value.pageid).removeClass("hidden");

              $(".iframe." + value.pageid).load(function() {

                $(".loading." + value.pageid).addClass("hidden");
                $(".iframe." + value.pageid).removeClass("hidden");
                //                     $('html, body').animate({
                //   scrollTop: $(".iframe." + value.pageid).offset().top
                // }, 900); //causes lag -cries in spanish-
              });
            });
            html = "";
          });
        } else {
          html += '<h2 class="text-center">No results found :(</h2>';
          $(".results-container").append(html);

        }

      },
      complete: function(data) {
        $('html, body').animate({
          scrollTop: $(".results-container").offset().top
        }, 2000);
      },
      error: function(err) {
        alert(err);
      },
      beforeSend: function(xhr) {
        $(".loading-search").removeClass("hidden");

      }
    });
  }

});