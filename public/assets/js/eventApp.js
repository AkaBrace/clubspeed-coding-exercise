angular.module('eventApp', ["ngRoute"])
    .controller('listEventsController', ['$http', function ($http)
        {
            var l_oDayOfEvents;
            var lf_generateJsonQueryString;
            var l_strApiUrlPath;

            l_strApiUrlPath = '/api/v1/event?query=';

            l_oDayOfEvents                  = this;
            l_oDayOfEvents.m_aryEvents      = [];
            l_oDayOfEvents.m_oTheCurrentDay = new Date();

            /**
             * Generates a query string used to obtain a list of events from the restify-mongoose API
             *
             * @private
             *
             * @returns {string} - A JSON formatted query string for restify-mongoose
             */
            lf_generateJsonQueryString = function ()
            {
                l_oDayOfEvents.m_intBeginOfDay = l_oDayOfEvents.m_oTheCurrentDay.setHours(0, 0, 0, 0);
                l_oDayOfEvents.m_intEndOfDay   = l_oDayOfEvents.m_oTheCurrentDay.setHours(23, 59, 59, 999);
                l_oDayOfEvents.m_strToday      = l_oDayOfEvents.m_oTheCurrentDay.toLocaleDateString();

                return JSON.stringify({
                        $and: [{
                            time: '>=' + l_oDayOfEvents.m_intBeginOfDay
                        }, {
                            time: '<=' + l_oDayOfEvents.m_intEndOfDay
                        }]
                    }
                );
            };

            $http.get(l_strApiUrlPath + lf_generateJsonQueryString())
                .success(
                    function (p_oResponseData)
                    {
                        l_oDayOfEvents.m_aryEvents = p_oResponseData;
                    }
                );
        }]
    )

    .controller('createEventController', ['$http', '$location',
        function ($http, $location)
        {
            var l_oEventToCreate;
            var l_strApiUrlPath;
            var l_oCurrDate;

            l_strApiUrlPath  = '/api/v1/event';
            l_oEventToCreate = this;
            l_oCurrDate      = new Date();

            this.m_strEventName       = "";
            this.m_strDatetimeOfEvent = new Date(
                l_oCurrDate.getFullYear(),
                l_oCurrDate.getMonth(),
                l_oCurrDate.getDate(),
                l_oCurrDate.getHours()
            );

            /**
             * Makes call to remote API to create a new event
             */
            this.submit = function ()
            {
                var l_oRequestBody;
                var l_cfgRequest;

                l_oRequestBody = JSON.stringify({
                        name: l_oEventToCreate.m_strEventName,
                        time: Date.parse(l_oEventToCreate.m_strDatetimeOfEvent)
                    }
                );

                l_cfgRequest = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                $http.post(l_strApiUrlPath, l_oRequestBody, l_cfgRequest)
                    .success(
                        function (p_oResponseData, p_oResponseStatus, p_oResponseHeaders, p_cfgResponse)
                        {
                            if (p_oResponseStatus) {
                                $location.path('/')
                            }
                        }
                    )
            };
        }]
    )

    .config(
        function ($routeProvider)
        {
            $routeProvider
                .when("/", {
                        templateUrl:  "../view/event-list.html",
                        controller:   'listEventsController',
                        controllerAs: "listEvents"
                    }
                )
                .when("/create", {
                        templateUrl:  "../view/event-create.html",
                        controller:   "createEventController",
                        controllerAs: 'createEvent'
                    }
                )
        }
    );
