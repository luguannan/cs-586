angular
    .module('MdAutocompleteBugApp', ['ngMaterial','ngAnimate','ngMessages'])
    .controller('MdAutocompleteBugController', function($scope, $q, $timeout,$http) {
    	var vm = this;
        dataArray = [];
        vm.symbol =  $scope.symbol;
        
       vm.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
              'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
              'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
              'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
              'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
              'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
              'Wisconsin', 'Wyoming'];


        vm.months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
        vm.years = ['2014','2015'];

    	$scope.searchresult= function(){
            var symbol = $scope.symbol;
            var year = $scope.year_selector;
            var month = $scope.month_selector;
            //var day = $scope.day_selector;
            console.log(month);
            vm.details = [];


            $http.get('./disaster',{params:{input:symbol,month:month,year:year}}).success(function (data){
                if (symbol == "earthquake"){
                    //var a  = data.split('\n');
                    //console.log(a);
                //var detail_item = []
                for (i in data){

                    vm.details.push(it);
                }
                //console.log(detail_item);
                //vm.details = detail_item;
                html1 = '<br><br><h3>I. The details of the disaster</h3><br><br>';
                document.getElementById("detail_t").innerHTML = html1;

                $("#detail_table").css("display","block");

                }
                if(symbol == "fire"){
                     //var a  = data.split('\r');

                //console.log(a);
                //var detail_item = []
                for (i in data){
                    var it = a[i].split("\t");
                    if (it[7] == "Campfire" && it[6] == "A" && it[8] == "4" && it[0].length > 12 ) vm.details.push(it);
                }
                console.log(vm.details.length);
                //vm.tableParams = new NgTableParams({}, { dataset: vm.details});

                //console.log(detail_item);
                //vm.details = detail_item;
                html1 = '<br><br><h3>I. The details of the disaster</h3><br><br>';
                document.getElementById("detail_t").innerHTML = html1;

                $("#detail_table").css("display","block");




                }
                //console.log(symbol);
                //console.log(data);

             }).error(function(data){
                alert("There is no disaster information.")
                console.log(data);
             });

        }



        $scope.show_tw = function(){

            $http.get('./ex',{params:{input:$scope.symbol}}).success(function (data) {
                console.log(symbol);
                //console.log(data);
                var a = data;

                //a.replace(/"""/g,'"');
                  //console.log(a);
                  
                var d = a.split('"');
                  //console.log(d);
                var x = [];
                var item = [];
                //console.log(d);
                for(i = 0; i < d.length ;i++){
                    if (d[i] == "\n"){
                        d.splice(i,1);
                    }
                    //d[i].replace(/\n/g,'');
                    if (d[i].length>0){
                        //x.push(d[i]);
                        x.push(d[i].replace(/\n/g,''));
                        if (d[i].substring(0,5)=="2015-" || d[i].substring(0,5)=="2014-" && x.length>=4){
                            item.push(x);
                            
                            x = [];
                            x.push(d[i].substring(0,10));

                        }
                    }
                   
                   
                }
                item[0][0] = item[0][0].substring(0,10);
                //console.log(item);
                //dataArray = item;
                //timearray=[['Date', 'Total Count']];
                times = [];
                //timearray[0] = item[0][0];
                timearray = [];
                timecount = {};
                locationarray = [];


                for(var a of item){
                    //console.log(a);
                    if (a[0] in timecount){
                        timecount[a[0]] += 1;
                    }
                    else{
                        timecount[a[0]] = 1;
                        times.push(a[0]);
                    }
                    times.sort(function(a,b){
                        var t = new Date(a);
                        var tmp = new Date(b);
                        return tmp-t;

                    });
                    times.reverse();
                    locationitem = [Number(a[2]),Number(a[1])];
                    //console.log(locationitem);
                    locationarray.push(locationitem);

                }
/*
                for (var i = 1; i < item.length; i++){
                    for (var j = 0; j < timearray.length; j++) {
                        if (item[i][0] == timearray[j]){
                            timecount[item[i][0]] = timecount[item[i][0]]+1;
                            console.log(item[i][0]);

                            break;

                        }else{
                            timearray.push(item[i][0]);
                            timecount[item[i][0]] = 1;
                        }
                    }
                   
                    

                } */  
               //console.log(timecount);


                for (var a in times){
                    var x = [times[a].substring(5,10),timecount[times[a]]];
                    timearray.push(x);
                }
                
                //console.log(locationarray);

 

                drawTime(timearray);
                drawMap(locationarray);
                $("#keywordcontainer").css("display","block");
               





/*
                html2 = '<h3> The number of tweets changes over time</h3><br>';
                html3 = '<h3> People discussed this disaster in these locations: </h3><br>';
                html4 = '<h3> Keywords Summary</h3><br>';
                html5 = '<h3> Sentiment Analysis </h3><br>';
*/
            
                //google.charts.setOnLoadCallback(drawMap);

                //google.charts.setOnLoadCallback(drawPie);

                //google.charts.setOnLoadCallback();    


             }).error(function(data){
                console.log(data);
             });


            $http.get('./sentiment',{params:{input:$scope.symbol}}).success(function (data) {
                console.log(symbol);
                //console.log(data);
                var a = data;

               // a.replace(/"""/g,'"');
                  //console.log(a);
                  
                var d = a.split('\n');
                var positive = 0;
                var negative = 0;
                var neutral = 0;
                for (var i = 0; i < d.length; i++) {
                    if (d[i] == "positive") positive+=1;
                    if (d[i] == "negative") negative+=1;
                    if (d[i] == "neutral") neutral+=1;
                }


                drawPie(positive,negative,neutral);
                  //console.log(d);



             }).error(function(data){
                console.log(data);
             });

        }


        function drawTime(timearray){
            html2 = '<h3>II. The number of tweets changes over time</h3><br><br>';
            document.getElementById("time_t").innerHTML = html2;

            //var timedata = [];
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Time');
            data.addColumn('number', 'Total count');
            
            //console.log(timearray);
            for(var i in timearray){
                data.addRow(timearray[i]);

            }
            //console.log(data);
            //var data = google.visualization.arrayToDataTable(a,false);

            var options = {
                title: 'The total count of tweets about the ' + $scope.symbol +' in a couple of days',
                hAxis: {
                    title: 'Time'
                },
                vAxis: {
                    title: '# of tweets'
                },
                legend: { position: 'right' }
            };

            var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

            chart.draw(data, options);
        }




        function drawMap(locationarray) {
            console.log(locationarray);
            html3 = '<h3> III. People discussed this disaster in these locations: </h3><br><br>';
            document.getElementById("location_t").innerHTML = html3;

            var data = new google.visualization.DataTable();
            data.addColumn('number', 'latitude');
            data.addColumn('number', 'longtitude');
            //data.addColumn('string', 'name');
            
            
            for(var i in locationarray){

                data.addRow(locationarray[i]);

            }

/*
            var data = google.visualization.arrayToDataTable([
                ['Lat', 'Long', 'Name'],
                [37.4232, -122.0853, 'Work'],
                [37.4289, -122.1697, 'University'],
                [37.6153, -122.3900, 'Airport'],
                [37.4422, -122.1731, 'Shopping']
            ]);
*/
            var options = {
                icons: {
                    default: {
                        normal: 'https://icons.iconarchive.com/icons/icons-land/vista-map-markers/48/Map-Marker-Ball-Azure-icon.png',
                        selected: 'https://icons.iconarchive.com/icons/icons-land/vista-map-markers/48/Map-Marker-Ball-Right-Azure-icon.png'
                    }
                }
            };

            var map = new google.visualization.Map(document.getElementById('map_markers_div'));
            map.draw(data, options);
            //$("#fema_img").css("display","block");
            html4 = '<h3> IV. Keywords Summary</h3><br><br>';
            //$("#keyword_t").css("display","block");
            document.getElementById("keyword_t").innerHTML = html4;


        }


        function drawPie(positive,negative,neutral) {
            html5 = '<h3> <br>V. Sentiment Analysis </h3><br><br>';

            document.getElementById("sentiment_t").innerHTML = html5;

            var data = google.visualization.arrayToDataTable([
                ['sensitive', 'counts'],
                ['positive',     positive],
                ['neutral',      neutral],
                ['negative',  negative],
            ]);

            var options = {
                title: 'Discover different attitudes of the authors'
            };

            var chart = new google.visualization.PieChart(document.getElementById('pie_chart'));

            chart.draw(data, options);
        }






});

   