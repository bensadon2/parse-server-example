
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('deleteFollowed', function(req, res) {
	//add implementation if we want to cleanup this thing
});

Parse.Cloud.define('pushScheduleChanged', function(request, response) {
    var params = request.params;
    var customData = params.customData;

    if (!customData) {
        response.error("Missing customData!")
    }

    var jsonData = JSON.parse(customData);
    var tournamentId = jsonData.tournamentId;
    // var query = new Parse.Query(Parse.Installation);
    // query.equalTo("installationId", sender);

    Parse.Push.send({
        // where: query,
        // Parse.Push requires a dictionary, not a string.
        channels: [tournamentId],
        data: {"refreshSchedule": true,
               "tournamentId": tournamentId}
    }, { success: function() {
        console.log("#### PUSH OK");
    }, error: function(error) {
        console.log("#### PUSH ERROR" + error.message);
    }, useMasterKey: true});

    response.success('success');
});

Parse.Cloud.define('pushEventChanged', function(request, response) {
    var params = request.params;
    var customData = params.customData;

    if (!customData) {
        response.error("Missing customData!")
    }

    var jsonData = JSON.parse(customData);
    var tournamentName = jsonData.tournamentName;
    var tournamentId = jsonData.tournamentId;
    var eventId = jsonData.eventId;
    var eventName = jsonData.eventName;
    var year = jsonData.year;
    var month = jsonData.month;
    var dayOfMonth = jsonData.dayOfMonth;
    var hour = jsonData.hour;
    var minute = jsonData.minute;
    var second = jsonData.second;


    var userQuery = new Parse.Query("AppUser");
    userQuery.equalTo("followedEvents", eventId);
    userQuery.find({
        success: function(results) {
            // console.log('results was: ' + results + '\n');
            var userIds = [];
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                userIds.push(object.get("id"));
                // alert(object.id + ' - ' + object.get('userId'));
                // console.log(object.id + ' - ' + object.get('userId'));
                console.log('\n' + 'found user: ' + object.get("id"));
            }

            console.log('user Ids were: ' + userIds);
            var query = new Parse.Query("_Installation");
            query.containedIn("userId", userIds);
            Parse.Push.send({
                where: query,
                // Parse.Push requires a dictionary, not a string.
                data: {"alert": "Event \"" + eventName + "\" in tournament \"" + tournamentName + "\" has changed",
                        "eventId": eventId,
                        "eventName": eventName,
                        "tournamentName": tournamentName,
                        "tournamentId": tournamentId,
                        "eventChanged": true,
                        "year":year,
                        "month":month,
                        "dayOfMonth":dayOfMonth,
                        "hour":hour,
                        "minute":minute,
                        "second":second}
            }, { success: function() {
                console.log("#### PUSH OK");
            }, error: function(error) {
                console.log("#### PUSH ERROR" + error.message);
            }, useMasterKey: true});
        },
        error: function(error) {
            // alert("Error: " + error.code + " " + error.message);
            console.log('Error: ' + error.code + " " + error.message);
        }
    });

    //This worked with channels
    // Parse.Push.send({
    //     channels: ["Event: " + eventId],
    //     // Parse.Push requires a dictionary, not a string.
    //     data: {"alert": "Event " + eventName + " in tournament " + tournamentName + " has changed"}
    // }, { success: function() {
    //     console.log("#### PUSH OK");
    // }, error: function(error) {
    //     console.log("#### PUSH ERROR" + error.message);
    // }, useMasterKey: true});

    // var query = new Parse.Query(Parse.Installation);
    // query.equalTo("installationId", sender);

    response.success('success');
});

Parse.Cloud.define('pushCompetitorEventChanged', function(request, response) {
    var params = request.params;
    var customData = params.customData;

    if (!customData) {
        response.error("Missing customData!")
    }

    var jsonData = JSON.parse(customData);
    var tournamentName = jsonData.tournamentName;
    var competitorId = jsonData.competitorId;
    var competitorName = jsonData.competitorName;
    var eventName = jsonData.eventName;
    var eventId = jsonData.eventId;
    var tournamentId = jsonData.tournamentId;
    var year = jsonData.year;
    var month = jsonData.month;
    var dayOfMonth = jsonData.dayOfMonth;
    var hour = jsonData.hour;
    var minute = jsonData.minute;
    var second = jsonData.second;


    // Failed attempt
    var userQuery = new Parse.Query("AppUser");
    userQuery.equalTo("followedCompetitors", competitorId);
    userQuery.find({
        success: function(results) {
            // console.log('results was: ' + results + '\n');
            var userIds = [];
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                userIds.push(object.get("id"));
                // alert(object.id + ' - ' + object.get('userId'));
                // console.log(object.id + ' - ' + object.get('userId'));
                console.log('\n' + 'found user: ' + object.get("id"));
            }

            console.log('user Ids were: ' + userIds);
            var query = new Parse.Query("_Installation");
            query.containedIn("userId", userIds);
            Parse.Push.send({
                where: query,
                // Parse.Push requires a dictionary, not a string.
                data: {"alert": competitorName + "'s event \"" + eventName +
                                "\" in tournament \"" + tournamentName + "\" has changed",
                    "eventId": eventId,
                    "eventName": eventName,
                    "tournamentName": tournamentName,
                    "tournamentId": tournamentId,
                    "competitorName": competitorName,
                    "competitorId": competitorId,
                    "competitorEventChanged": true,
                    "year":year,
                    "month":month,
                    "dayOfMonth":dayOfMonth,
                    "hour":hour,
                    "minute":minute,
                    "second":second}
            }, { success: function() {
                console.log("#### PUSH OK");
            }, error: function(error) {
                console.log("#### PUSH ERROR" + error.message);
            }, useMasterKey: true});
        },
        error: function(error) {
            // alert("Error: " + error.code + " " + error.message);
            console.log('Error: ' + error.code + " " + error.message);
        }
    });

    response.success('success');
});

Parse.Cloud.define('testPush', function(request, response) {
    var params = request.params;
    var customData = params.customData;

    if (!customData) {
        response.error("Missing customData!")
    }

    var jsonData = JSON.parse(customData);
    var sender = jsonData.sender;
    var query = new Parse.Query(Parse.Installation);
    query.equalTo("installationId", sender);

    Parse.Push.send({
        where: query,
        // Parse.Push requires a dictionary, not a string.
        data: {"alert": "This is a push notification test"}
    }, { success: function() {
        console.log("#### PUSH OK");
    }, error: function(error) {
        console.log("#### PUSH ERROR" + error.message);
    }, useMasterKey: true});

    response.success('success');
});
