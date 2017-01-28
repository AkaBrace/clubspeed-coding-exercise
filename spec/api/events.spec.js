var g_oRequest;
var g_oFrisby;
var g_strApiServerHost;
var g_strResourceUrl;

g_oRequest = require('request');
g_oFrisby  = require('frisby');

g_strResourceUrl   = '/api/v1/event';
g_strApiServerHost = 'http://localhost:3000'; // TODO: This should be driven by an env var for CI in the future

// TODO: Implement configuration to optionally cleanup test data after the test has been ran
describe('Suite 1: CREATE - Test API for events resource',
    function ()
    {
        it('Case 1: Verify that new events are created when using correct values and types',
            function ()
            {
                var l_strDataName;
                var l_intCurrDate;

                l_strDataName = 'Test Event Resource - Suite 1:Case 1';
                l_intCurrDate = Date.now();

                g_oFrisby
                    .create('Verify that new events are created when using correct values and types')
                    .post(g_strApiServerHost + g_strResourceUrl,
                        {
                            name: l_strDataName,
                            time: l_intCurrDate
                        },
                        {
                            json: true
                        }
                    )
                    .expectJSON(
                        {
                            name: l_strDataName,
                            time: l_intCurrDate
                        }
                    )
                    .expectJSONTypes(
                        {
                            name: String,
                            time: Number
                        }
                    )
                    .expectStatus(201)
                    .expectHeader('Content-Type', 'application/json; charset=utf-8')
                    .toss();
            }
        );

        // TODO: A better test would be to count the number of event documents before and after
        it('Case 2: Verify that new events are NOT created when using the wrong data type for the name field',
            function ()
            {
                var l_strDataName;
                var l_intCurrDate;

                l_strDataName = {testKey: '42'}; // Numbers and Arrays are valid, but Objects are not
                l_intCurrDate = Date.now();

                g_oFrisby
                    .create('Verify that new events are NOT created when using the wrong data type for the name field')
                    .post(g_strApiServerHost + g_strResourceUrl,
                        {
                            name: l_strDataName,
                            time: l_intCurrDate
                        },
                        {
                            json: true
                        }
                    )
                    .expectStatus(400)
                    .expectHeader('Content-Type', 'application/json; charset=utf-8')
                    .toss();
            }
        );

        // TODO: A better test would be to count the number of event documents before and after
        it('Case 3: Verify that new events are NOT created when using the wrong data type for the time field',
            function ()
            {
                var l_strDataName;
                var l_intCurrDate;

                l_strDataName = 'Test Event Resource - Suite 1:Case 3';
                l_intCurrDate = 'I am intentionally the wrong type';

                g_oFrisby
                    .create('Verify that new events are NOT created when using the wrong data type for the name field')
                    .post(g_strApiServerHost + g_strResourceUrl,
                        {
                            name: l_strDataName,
                            time: l_intCurrDate
                        },
                        {
                            json: true
                        }
                    )
                    .expectStatus(400)
                    .expectHeader('Content-Type', 'application/json; charset=utf-8')
                    .toss();
            }
        );

        // TODO: A better test would be to count the number of event documents before and after
        it('Case 4: Verify that new events are NOT created when the name field has an empty value',
            function ()
            {
                var l_strDataName;
                var l_intCurrDate;

                l_strDataName = '';
                l_intCurrDate = Date.now();

                g_oFrisby
                    .create('Verify that new events are NOT created when the name field has an empty value')
                    .post(g_strApiServerHost + g_strResourceUrl,
                        {
                            name: l_strDataName,
                            time: l_intCurrDate
                        },
                        {
                            json: true
                        }
                    )
                    .expectStatus(400)
                    .expectHeader('Content-Type', 'application/json; charset=utf-8')
                    .toss();
            }
        );

        // TODO: A better test would be to count the number of event documents before and after
        it('Case 5: Verify that new events are NOT created when the time field has an undefined value',
            function ()
            {
                var l_strDataName;
                var l_intCurrDate;

                l_strDataName = 'Test Event Resource - Suite 1:Case 5';

                g_oFrisby
                    .create('Verify that new events are NOT created when the time field has an undefined value')
                    .post(g_strApiServerHost + g_strResourceUrl,
                        {
                            name: l_strDataName,
                            time: l_intCurrDate
                        },
                        {
                            json: true
                        }
                    )
                    .expectStatus(400)
                    .expectHeader('Content-Type', 'application/json; charset=utf-8')
                    .toss();
            }
        );

        // TODO: A better test would be to count the number of event documents before and after
        it('Case 6: Verify that new events are NOT created when both field values are undefined',
            function ()
            {
                var l_strDataName;
                var l_intCurrDate;

                g_oFrisby
                    .create('Verify that new events are NOT created when both field values are undefined')
                    .post(g_strApiServerHost + g_strResourceUrl,
                        {
                            name: l_strDataName,
                            time: l_intCurrDate
                        },
                        {
                            json: true
                        }
                    )
                    .expectStatus(400)
                    .expectHeader('Content-Type', 'application/json; charset=utf-8')
                    .toss();
            }
        );
    }
);

describe('Suite 2: READ - Test API for events resource',
    function ()
    {
        it('Case 1: Verify that a single event can be read when using a valid _id value',
            function ()
            {
                var l_strDataName;
                var l_intCurrDate;

                l_strDataName = 'Test Event Resource - Suite 2:Case 1';
                l_intCurrDate = Date.now();

                g_oFrisby
                    .create('Create a new event')
                    .post(g_strApiServerHost + g_strResourceUrl,
                        {
                            name: l_strDataName,
                            time: l_intCurrDate
                        },
                        {
                            json: true
                        }
                    )
                    .afterJSON(
                        function (p_jsonResponse)
                        {
                            g_oFrisby
                                .create('Verify that a single event can be read when using a valid _id value')
                                .get(g_strApiServerHost + g_strResourceUrl + '/' + p_jsonResponse._id)
                                .expectJSON(
                                    {
                                        name: l_strDataName,
                                        time: l_intCurrDate
                                    }
                                )
                                .expectJSONTypes(
                                    {
                                        name: String,
                                        time: Number
                                    }
                                )
                                .expectStatus(200)
                                .expectHeader('Content-Type', 'application/json; charset=utf-8')
                                .toss();
                        }
                    )
                    .toss();
            }
        );

        // TODO: A better test would be to count the number of event documents before and after
        it('Case 2: Verify that a single event can NOT be read when using an unknown _id value',
            function ()
            {
                var l_strDataName;
                var l_intCurrDate;

                l_strDataName = 'Test Event Resource - Suite 2:Case 2';
                l_intCurrDate = Date.now();

                g_oFrisby
                    .create('Create a new event')
                    .post(g_strApiServerHost + g_strResourceUrl,
                        {
                            name: l_strDataName,
                            time: l_intCurrDate
                        },
                        {
                            json: true
                        }
                    )
                    .afterJSON(
                        function (p_jsonResponse)
                        {
                            g_oFrisby
                                .create('Verify that a single event can NOT be read when using an unknown _id value')
                                .get(g_strApiServerHost + g_strResourceUrl + '/' + 'foo')
                                .expectStatus(404)
                                .expectHeader('Content-Type', 'application/json; charset=utf-8')
                                .toss();
                        }
                    )
                    .toss();
            }
        );

        it('Case 3: Verify that multiple events are fetched when using GET',
            function ()
            {
                var l_strDataName1;
                var l_intCurrDate1;
                var l_strDataName2;
                var l_intCurrDate2;

                l_strDataName1 = 'Test Event Resource - Suite 2:Case 3 - First Event';
                l_intCurrDate1 = Date.now();
                l_strDataName2 = 'Test Event Resource - Suite 2:Case 3 - Second Event';
                l_intCurrDate2 = l_intCurrDate1 + 1;

                g_oFrisby
                    .create('Create the first new event')
                    .post(g_strApiServerHost + g_strResourceUrl,
                        {
                            name: l_strDataName1,
                            time: l_intCurrDate1
                        },
                        {
                            json: true
                        }
                    )
                    .afterJSON(
                        function (p_jsonResponse1)
                        {
                            g_oFrisby
                                .create('Create the second new event')
                                .post(g_strApiServerHost + g_strResourceUrl,
                                    {
                                        name: l_strDataName2,
                                        time: l_intCurrDate2
                                    },
                                    {
                                        json: true
                                    }
                                )
                                .afterJSON(
                                    function (p_jsonResponse2)
                                    {
                                        g_oFrisby
                                            .create('Verify that multiple events are fetched when using GET')
                                            .get(g_strApiServerHost + g_strResourceUrl)
                                            .expectJSON('?',
                                                {
                                                    name: l_strDataName1,
                                                    time: l_intCurrDate1
                                                }
                                            )
                                            .expectJSON('?',
                                                {
                                                    name: l_strDataName2,
                                                    time: l_intCurrDate2
                                                }
                                            )
                                            .expectJSONTypes('?',
                                                {
                                                    name: String,
                                                    time: Number
                                                }
                                            )
                                            .expectStatus(200)
                                            .expectHeader('Content-Type', 'application/json; charset=utf-8')
                                            .toss();
                                    }
                                )
                                .toss();
                        }
                    )
                    .toss();
            }
        );

        // This test uses Jasmine and not FrisbyJS.
        it('Case 4: Verify that only events between dates are fetched when using GET',
            function ()
            {
                var lf_responseHandler;
                var lf_requestHandler;

                var l_aryTestDataSuite2Case4 = [];

                var l_aryValidVals   = [];
                var l_aryInvalidVals = [];

                /**
                 * The actual test. Handles the response after querying the data for the tests via the API.
                 *
                 * @param p_oError
                 * @param p_oResponse
                 * @param p_jsonBody
                 */
                lf_responseHandler = function (p_oError, p_oResponse, p_jsonBody)
                {
                    var l_oResponse;
                    var l_nIterator;

                    l_oResponse = JSON.parse(p_jsonBody);

                    for (l_nIterator = 0; l_nIterator < l_oResponse.length; l_nIterator++) {
                        expect(l_aryValidVals).toContain(l_oResponse[l_nIterator].time);
                        expect(l_aryInvalidVals).not.toContain(l_oResponse[l_nIterator].time);
                    }
                };

                /**
                 * Handles the response after the mocked data is POSTed via the API, then queries via the API.
                 *
                 * @param p_oError
                 * @param p_oResponse
                 * @param p_jsonBody
                 */
                lf_requestHandler = function (p_oError, p_oResponse, p_jsonBody)
                {
                    g_oRequest(
                        {
                            url: g_strApiServerHost + g_strResourceUrl,
                            qs:  {
                                query: JSON.stringify({
                                        $and: [
                                            {
                                                time: '>=' + new Date(2017, 1, 25, 0, 0, 0).valueOf()
                                            },
                                            {
                                                time: '<=' + new Date(2017, 1, 25, 23, 59, 59, 999).valueOf()
                                            }
                                        ]
                                    }
                                )
                            }
                        }, lf_responseHandler
                    );
                };

                l_aryValidVals.push(
                    // l_int2DaysAgo1
                    new Date(2017, 1, 25, 3, 24, 11).valueOf(),
                    // l_int2DaysAgo2
                    new Date(2017, 1, 25, 3, 24, 11).valueOf(),
                    // l_int2DaysAgo3
                    new Date(2017, 1, 25, 18, 24, 13).valueOf()
                );

                l_aryInvalidVals.push(
                    // l_int3DaysAgo1
                    new Date(2017, 1, 24, 3, 24, 1).valueOf(),
                    // l_int3DaysAgo2
                    new Date(2017, 1, 24, 10, 24, 2).valueOf(),
                    // l_int3DaysAgo3
                    new Date(2017, 1, 24, 18, 24, 3).valueOf(),
                    // l_int1DaysAgo1
                    new Date(2017, 1, 26, 3, 24, 21).valueOf(),
                    // l_int1DaysAgo2
                    new Date(2017, 1, 26, 10, 24, 22).valueOf(),
                    // l_int1DaysAgo3
                    new Date(2017, 1, 26, 18, 24, 23).valueOf()
                );

                for (l_nIterator = 0; l_nIterator < l_aryValidVals.length; l_nIterator++) {
                    l_aryTestDataSuite2Case4.push({
                            name: 'Test Event Resource - Suite 2:Case 4 - ' + 1 + l_nIterator,
                            time: l_aryValidVals[l_nIterator]
                        }
                    );
                }
                for (l_nIterator = 0; l_nIterator < l_aryInvalidVals.length; l_nIterator++) {
                    l_aryTestDataSuite2Case4.push({
                            name: 'Test Event Resource - Suite 2:Case 4 - ' + 2 + l_nIterator,
                            time: l_aryInvalidVals[l_nIterator]
                        }
                    );
                }

                g_oRequest({
                        url:     g_strApiServerHost + g_strResourceUrl,
                        body:    JSON.stringify(l_aryTestDataSuite2Case4),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method:  "POST"
                    }, lf_requestHandler
                );
            }
        );
    }
);

describe('Suite 3: UPDATE - Test API for events resource',
    function ()
    {
        it('Case 1: Verify that one can edit/modify a field for an existing event',
            function ()
            {
                var l_iTargetEventId;
                var l_oOrigEventTime;
                var l_oEventWithMutation;

                l_oOrigEventTime = Date.now();

                g_oFrisby
                    .create('Create an initial test event for this case')
                    .post(g_strApiServerHost + g_strResourceUrl,
                        {
                            name: 'test event for Suite 3:Case 1',
                            time: l_oOrigEventTime
                        },
                        {
                            json: true
                        }
                    )
                    .afterJSON(
                        function (p_oResponse1)
                        {
                            l_iTargetEventId          = p_oResponse1._id;
                            l_oOrigEventTime          = p_oResponse1.time;
                            l_oEventWithMutation      = p_oResponse1;
                            l_oEventWithMutation.time = l_oEventWithMutation.time + 1;

                            g_oFrisby
                                .create('Mutate the time value of said event by incrementing by 1')
                                .put(g_strApiServerHost + g_strResourceUrl + '/' + l_iTargetEventId,
                                    l_oEventWithMutation,
                                    {
                                        json: true
                                    }
                                )
                                .afterJSON(
                                    function ()
                                    {
                                        g_oFrisby
                                            .create('Fetch an event using an _id value')
                                            .get(g_strApiServerHost + g_strResourceUrl + '/' + l_iTargetEventId)
                                            .expectJSON(
                                                {
                                                    time: l_oOrigEventTime + 1
                                                }
                                            )
                                            .inspectJSON()
                                            .toss();
                                    }
                                )
                                .toss();
                        }
                    )
                    .toss();
            }
        )
    }
);

describe('Suite 4: DELETE - Test API for events resource',
    function ()
    {
        it('Case 1: Verify that one can delete an existing event',
            function ()
            {
                var l_iTargetEventId;

                g_oFrisby
                    .create('Create an initial test event for this case')
                    .post(g_strApiServerHost + g_strResourceUrl,
                        {
                            name: 'test event for Suite 4:Case 1',
                            time: Date.now()
                        },
                        {
                            json: true
                        }
                    )
                    .afterJSON(
                        function (p_oResponse)
                        {
                            l_iTargetEventId = p_oResponse._id;

                            g_oFrisby
                                .create('Mutate the time value of said event by incrementing by 1')
                                .delete(g_strApiServerHost + g_strResourceUrl + '/' + l_iTargetEventId)
                                .expectStatus(204)
                                .toss();
                        }
                    )
                    .toss();
            }
        );

        // This test will clean up all the test data by deleting everything
        xit('Case 2: Verify that one can delete all events',
            function (pf_done)
            {
                g_oFrisby
                    .create('Create an initial test event for this case')
                    .delete(g_strApiServerHost + g_strResourceUrl)
                    .expectStatus(204)
                    .toss();
                pf_done();
            }
        );
    }
);
