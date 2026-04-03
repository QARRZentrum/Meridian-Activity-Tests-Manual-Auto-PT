/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 80.76923076923077, "KoPercent": 19.23076923076923};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Enter Login Cre-and Login-2"], "isController": false}, {"data": [0.0, 500, 1500, "Enter Login Cre-and Login-1"], "isController": false}, {"data": [0.125, 500, 1500, "Click on Sign Out"], "isController": true}, {"data": [0.0, 500, 1500, "Enter Login Cre-and Login"], "isController": true}, {"data": [0.35, 500, 1500, "Search for Dubai Marina Yacht - Shared Tour-1"], "isController": false}, {"data": [1.0, 500, 1500, "Click on Sign Out-1-0"], "isController": false}, {"data": [1.0, 500, 1500, "Enter Location, In&OutDate , & Headcount"], "isController": true}, {"data": [0.35, 500, 1500, "Click on Sign Out-1"], "isController": false}, {"data": [1.0, 500, 1500, "Click on Sign Out-2"], "isController": false}, {"data": [0.6, 500, 1500, "Click on Sign Out-1-1"], "isController": false}, {"data": [0.0, 500, 1500, "Click on Sign Out-3"], "isController": false}, {"data": [0.2, 500, 1500, "Enter Location, In&OutDate , & Headcount-6"], "isController": false}, {"data": [1.0, 500, 1500, "Enter Location, In&OutDate , & Headcount-4"], "isController": false}, {"data": [0.8, 500, 1500, "Enter Location, In&OutDate , & Headcount-5"], "isController": false}, {"data": [1.0, 500, 1500, "Enter Location, In&OutDate , & Headcount-2"], "isController": false}, {"data": [0.5, 500, 1500, "Enter Location, In&OutDate , & Headcount-3"], "isController": false}, {"data": [0.675, 500, 1500, "Enter Location, In&OutDate , & Headcount-1"], "isController": false}, {"data": [1.0, 500, 1500, "Enter Login Cre-and Login-8"], "isController": false}, {"data": [0.15, 500, 1500, "Enter Login Cre-and Login-7"], "isController": false}, {"data": [0.0, 500, 1500, "Enter Login Cre-and Login-3"], "isController": false}, {"data": [0.0, 500, 1500, "Enter Login Cre-and Login-6"], "isController": false}, {"data": [1.0, 500, 1500, "Enter Login Cre-and Login-5"], "isController": false}, {"data": [0.2, 500, 1500, "Enter URl-1"], "isController": false}, {"data": [0.425, 500, 1500, "Search for Dubai Marina Yacht - Shared Tour"], "isController": true}, {"data": [1.0, 500, 1500, "Enter URl"], "isController": true}, {"data": [0.1, 500, 1500, "Search for Dubai Marina Yacht - Shared Tour-6"], "isController": false}, {"data": [0.0, 500, 1500, "User Journey – Activity Booking"], "isController": true}, {"data": [0.0, 500, 1500, "Search for Dubai Marina Yacht - Shared Tour-5"], "isController": false}, {"data": [0.85, 500, 1500, "Search for Dubai Marina Yacht - Shared Tour-4"], "isController": false}, {"data": [0.95, 500, 1500, "Search for Dubai Marina Yacht - Shared Tour-3"], "isController": false}, {"data": [1.0, 500, 1500, "Search for Dubai Marina Yacht - Shared Tour-2"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 260, 50, 19.23076923076923, 764.7384615384613, 25, 3252, 374.5, 2007.6, 2390.1999999999994, 2796.489999999999, 0.24387201221611188, 4.026060919463144, 0.2544956134694264], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Enter Login Cre-and Login-2", 10, 10, 100.0, 311.5, 284, 334, 309.0, 334.0, 334.0, 334.0, 1.4236902050113895, 5.312422141941913, 4.341142867312072], "isController": false}, {"data": ["Enter Login Cre-and Login-1", 10, 10, 100.0, 366.8999999999999, 319, 398, 366.0, 398.0, 398.0, 398.0, 1.4144271570014144, 1.7036664603960396, 2.874436439179632], "isController": false}, {"data": ["Click on Sign Out", 20, 0, 0.0, 1830.9499999999998, 433, 2852, 1964.0, 2374.2000000000003, 2829.0499999999997, 2852.0, 0.07698259038718394, 0.15458164292395277, 0.13455038197799069], "isController": true}, {"data": ["Enter Login Cre-and Login", 10, 10, 100.0, 3758.1, 2757, 4772, 3718.0, 4722.2, 4772.0, 4772.0, 1.0198878123406425, 393.00779258031616, 10.036831495410505], "isController": true}, {"data": ["Search for Dubai Marina Yacht - Shared Tour-1", 10, 0, 0.0, 1537.1999999999998, 326, 3252, 1847.0, 3134.4000000000005, 3252.0, 3252.0, 1.179106237471996, 1.5622006175568919, 1.1073695982195495], "isController": false}, {"data": ["Click on Sign Out-1-0", 10, 0, 0.0, 327.29999999999995, 299, 358, 329.0, 357.1, 358.0, 358.0, 1.6278691193228065, 1.195466384502686, 1.480661423571545], "isController": false}, {"data": ["Enter Location, In&OutDate , & Headcount", 20, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.1530596626565035, 0.0, 0.0], "isController": true}, {"data": ["Click on Sign Out-1", 10, 0, 0.0, 1224.9, 386, 1636, 1474.0, 1634.7, 1636.0, 1636.0, 1.6129032258064515, 3.8035534274193545, 2.6715284778225805], "isController": false}, {"data": ["Click on Sign Out-2", 10, 0, 0.0, 374.3, 47, 490, 450.5, 486.6, 490.0, 490.0, 2.166377816291161, 2.8700274859185444, 1.617801871208839], "isController": false}, {"data": ["Click on Sign Out-1-1", 10, 0, 0.0, 897.1999999999998, 57, 1293, 1175.0, 1292.1, 1293.0, 1293.0, 1.7099863201094392, 2.7767238799589604, 1.276979041980164], "isController": false}, {"data": ["Click on Sign Out-3", 10, 0, 0.0, 2062.7000000000003, 1568, 2852, 1964.0, 2806.1000000000004, 2852.0, 2852.0, 1.6244314489928524, 0.5409483633853152, 1.7746596308479532], "isController": false}, {"data": ["Enter Location, In&OutDate , & Headcount-6", 10, 0, 0.0, 1856.4, 893, 2563, 2119.0, 2558.4, 2563.0, 2563.0, 1.0799136069114472, 0.35961966792656586, 1.585806729211663], "isController": false}, {"data": ["Enter Location, In&OutDate , & Headcount-4", 10, 0, 0.0, 36.2, 29, 47, 35.0, 46.9, 47.0, 47.0, 1.2396181975951406, 0.7227070937151358, 0.7566029038056279], "isController": false}, {"data": ["Enter Location, In&OutDate , & Headcount-5", 10, 0, 0.0, 597.8999999999999, 222, 2606, 224.5, 2422.500000000001, 2606.0, 2606.0, 1.1388224575788635, 0.8375460867213301, 1.0131516199749457], "isController": false}, {"data": ["Enter Location, In&OutDate , & Headcount-2", 10, 0, 0.0, 265.59999999999997, 261, 276, 264.0, 275.2, 276.0, 276.0, 1.349345567399811, 3.072264834367832, 0.7207929935231413], "isController": false}, {"data": ["Enter Location, In&OutDate , & Headcount-3", 10, 0, 0.0, 770.6999999999999, 743, 815, 766.0, 812.5, 815.0, 815.0, 1.194885888397658, 2.7208158456804874, 0.676790835225236], "isController": false}, {"data": ["Enter Location, In&OutDate , & Headcount-1", 20, 0, 0.0, 663.9, 368, 1191, 767.5, 806.6, 1171.7999999999997, 1191.0, 0.0409364625165281, 0.5240466857328241, 0.020268346187382564], "isController": false}, {"data": ["Enter Login Cre-and Login-8", 10, 0, 0.0, 160.3, 144, 179, 159.0, 178.7, 179.0, 179.0, 1.6860563142808969, 631.2502634462991, 0.5515906887540044], "isController": false}, {"data": ["Enter Login Cre-and Login-7", 10, 0, 0.0, 1864.1000000000001, 966, 2426, 1887.5, 2423.2, 2426.0, 2426.0, 1.248595330253465, 0.4157919996254214, 1.6164676067549006], "isController": false}, {"data": ["Enter Login Cre-and Login-3", 10, 10, 100.0, 370.2, 323, 672, 338.5, 640.1000000000001, 672.0, 672.0, 1.4166312508853944, 5.476995236577419, 1.9276699072106531], "isController": false}, {"data": ["Enter Login Cre-and Login-6", 10, 10, 100.0, 383.6, 305, 891, 329.5, 837.0000000000002, 891.0, 891.0, 1.4206563432305725, 1.2389122211961927, 1.4447964021878108], "isController": false}, {"data": ["Enter Login Cre-and Login-5", 10, 0, 0.0, 301.5, 259, 332, 312.0, 330.5, 332.0, 332.0, 1.4184397163120568, 1.3367132092198581, 1.0782358156028369], "isController": false}, {"data": ["Enter URl-1", 10, 0, 0.0, 1852.2, 831, 2573, 1949.5, 2564.6, 2573.0, 2573.0, 1.03498240529911, 0.6536358608466155, 0.8742771294762989], "isController": false}, {"data": ["Search for Dubai Marina Yacht - Shared Tour", 20, 10, 50.0, 2537.85, 368, 6573, 2114.0, 6339.500000000001, 6564.15, 6573.0, 0.4050714951188885, 6.055363937750638, 1.3558818912788106], "isController": true}, {"data": ["Enter URl", 10, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 1.1130899376669634, 0.0, 0.0], "isController": true}, {"data": ["Search for Dubai Marina Yacht - Shared Tour-6", 10, 0, 0.0, 1906.0, 907, 2761, 1857.5, 2747.5, 2761.0, 2761.0, 1.3123359580052494, 0.43701812664041995, 2.0437325705380576], "isController": false}, {"data": ["User Journey – Activity Booking", 10, 0, 0.0, 6163.0, 4159, 9400, 5726.5, 9234.400000000001, 9400.0, 9400.0, 0.7147451933385748, 5.4431615636837964, 3.8918015375955974], "isController": true}, {"data": ["Search for Dubai Marina Yacht - Shared Tour-5", 10, 10, 100.0, 341.4, 308, 370, 342.5, 369.1, 370.0, 370.0, 1.7358097552508247, 1.513748155702135, 1.7619147066481513], "isController": false}, {"data": ["Search for Dubai Marina Yacht - Shared Tour-4", 10, 0, 0.0, 312.09999999999997, 44, 1020, 76.0, 1015.1, 1020.0, 1020.0, 1.5448787270199291, 1.3321561679283176, 1.32159547350533], "isController": false}, {"data": ["Search for Dubai Marina Yacht - Shared Tour-3", 10, 0, 0.0, 404.4, 329, 719, 372.5, 692.9000000000001, 719.0, 719.0, 1.4532771399505886, 1.5959083436273798, 1.783102928353437], "isController": false}, {"data": ["Search for Dubai Marina Yacht - Shared Tour-2", 10, 0, 0.0, 30.800000000000004, 25, 50, 28.5, 48.400000000000006, 50.0, 50.0, 1.5151515151515151, 0.8833451704545455, 0.9721235795454546], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["403/Forbidden", 30, 60.0, 11.538461538461538], "isController": false}, {"data": ["401/Unauthorized", 10, 20.0, 3.8461538461538463], "isController": false}, {"data": ["429/Too Many Requests", 10, 20.0, 3.8461538461538463], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 260, 50, "403/Forbidden", 30, "401/Unauthorized", 10, "429/Too Many Requests", 10, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Enter Login Cre-and Login-2", 10, 10, "403/Forbidden", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Enter Login Cre-and Login-1", 10, 10, "429/Too Many Requests", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Enter Login Cre-and Login-3", 10, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Enter Login Cre-and Login-6", 10, 10, "403/Forbidden", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Search for Dubai Marina Yacht - Shared Tour-5", 10, 10, "403/Forbidden", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
