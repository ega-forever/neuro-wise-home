angular.module('RrAppMenuCtrl', [])
    .controller('menuCtrl', function ($localStorage, $scope) {

        _.chain(document.getElementsByClassName('demo-content')).forEach(i => i.style.display = "none").value();


        _.chain(document.getElementsByClassName('mdl-menu_manipulate')).forEach(function (i) {


            i.onclick = function () {

                _.chain(document.getElementsByClassName('demo-content')).forEach(i => i.style.display = "none").value();

                document.getElementById(i.getAttribute('href').replace("#", "")).style.display = "block";
                document.getElementById(i.getAttribute('href'));
            }
        }).value();


        _.chain(document.querySelectorAll('nav a')).forEach(function(d){
          d.addEventListener('click', function() {
              document.querySelector('.demo-header .mdl-layout__drawer-button').click();
          });
        }).value();


        if ($localStorage.token != null && $localStorage.username != null) {
            document.getElementById("things").style.display = "block";
        } else {
            document.getElementById("auth").style.display = "block";
        }

    })
