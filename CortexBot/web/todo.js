angular.module("app", [])
    .controller("controller",
    function($scope, $http) {
        var spillerSearch = this;
        $scope.data = [];
        $scope.navn = '';
        $scope.avaturURL = '';

        spillerSearch.getSpiller = function() {

        };

        spillerSearch.permissions = [
            {perm: "ban", value:  2, status: false},
            {perm: "clear", value:  4, status: false},
            {perm: "kick", value:  8, status: false},
            {perm: "mute", value:  16, status: false},
            {perm: "punishments", value:  32, status: false},
            {perm: "ranks", value:  64, status: false},
            {perm: "botsend", value:  128, status: false},
            {perm: "sticky", value:  256, status: false},
            {perm: "ticketsetup", value:  512, status: false},
            {perm: "userinfo", value:  1024, status: false},
            {perm: "vehicls", value:  2048, status: false},
            {perm: "warn", value:  4096, status: false}
        ];

        spillerSearch.search = function() {
            if(spillerSearch.spillerId === null) return;
            $http.get(`http://localhost:3000/getData/${spillerSearch.spillerId}`).then(function(data) {
                $scope.data = data.data.data;
                for(const [key, value] of Object.entries(spillerSearch.permissions)){
                    if($scope.data[0]["permissions"] & spillerSearch.permissions[key]["value"]){
                        spillerSearch.permissions[key]["status"] = true;
                    };
                }
            });
        };

        spillerSearch.opdater = function() {
            var permissions = 0;
            for(const [key, value] of Object.entries(spillerSearch.permissions)){
                if(spillerSearch.permissions[key]["status"] === true){
                    permissions += spillerSearch.permissions[key]["value"];
                }
            }
            $http.post(`http://localhost:3000/setData/${spillerSearch.spillerId}/${permissions}`).then(function(data) {});
            spillerSearch.spillerId = '';
            $scope.data = [];
            for(const [key, value] of Object.entries(spillerSearch.permissions)){
                spillerSearch.permissions[key]["status"] = false;
            }
            $http.get(`http://localhost:3000/getDiscord/${spillerSearch.spillerId}`).then(function(data) {});
        };
    }
);