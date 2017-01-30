angular.module('commonActions', [])
    .factory('goBack', ['$location',
            function ($location)
            {
                var lf_goBack;

                /**
                 * Redirects user to the home page.
                 */
                lf_goBack = function ()
                {
                    $location.path('/');
                };

                return lf_goBack;
            }
        ]
    );

angular.module('eventApp', ["ngRoute", 'commonActions'])
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
             * Flips the event list to the next day of events
             */
            this.gotoListForNextDay = function ()
            {
                var l_oTheNextDay;

                l_oTheNextDay = new Date();
                l_oTheNextDay.setDate(l_oDayOfEvents.m_oTheCurrentDay.getDate() + 1);
                l_oDayOfEvents.m_oTheCurrentDay = l_oTheNextDay;

                $http.get(l_strApiUrlPath + lf_generateJsonQueryString())
                    .success(
                        function (p_oResponseData)
                        {
                            l_oDayOfEvents.m_aryEvents = p_oResponseData;
                        }
                    );

            };

            /**
             * Flips the event list to the previous day of events
             */
            this.gotoListForPreviousDay = function ()
            {
                var l_oThePreviousDay;

                l_oThePreviousDay = new Date();
                l_oThePreviousDay.setDate(l_oDayOfEvents.m_oTheCurrentDay.getDate() - 1);
                l_oDayOfEvents.m_oTheCurrentDay = l_oThePreviousDay;

                $http.get('/api/v1/event?query=' + lf_generateJsonQueryString())
                    .success(
                        function (p_oResponseData)
                        {
                            l_oDayOfEvents.m_aryEvents = p_oResponseData;
                        }
                    );

            };

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

    .controller('createEventController', ['$http', 'goBack',
        function ($http, pf_goBack)
        {
            var l_oEventToCreate;
            var l_strApiUrlPath;
            var l_oCurrDate;

            l_strApiUrlPath  = '/api/v1/event';
            l_oEventToCreate = this;
            l_oCurrDate      = new Date();

            this.m_strEventName       = "";
            this.mf_goBack            = pf_goBack;
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
                                l_oEventToCreate.mf_goBack();
                            }
                        }
                    )
            };
        }]
    )

    .controller('editEventController', ['$http', '$routeParams', 'goBack',
        function ($http, $routeParams, pf_goBack)
        {
            var l_oEventToEdit = this;

            var l_strApiUrlPath = '/api/v1/event/';

            this.m_strEventName         = "";
            this.m_strDatetimeOfEvent   = "";
            this.m_oEventBeforeMutation = {};
            this.mf_goBack              = pf_goBack;

            /**
             * Modifies an existing event
             */
            this.edit = function ()
            {
                var l_oRequestData;
                var l_cfgRequest;

                l_oRequestData = JSON.stringify({
                        name: l_oEventToEdit.m_strEventName,
                        time: Date.parse(l_oEventToEdit.m_strDatetimeOfEvent)
                    }
                );

                l_cfgRequest = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                $http.put(l_strApiUrlPath + l_oEventToEdit.m_oEventBeforeMutation['_id'], l_oRequestData, l_cfgRequest)
                    .success(
                        function (p_oResponseData, p_oResponseStatus, p_oResonseHeaders, p_cfgResponse)
                        {
                            if (p_oResponseStatus) {
                                l_oEventToEdit.mf_goBack();
                            }

                        }
                    )
            };

            /**
             * Deletes an event
             */
            this.delete = function ()
            {
                $http.delete(l_strApiUrlPath + l_oEventToEdit.m_oEventBeforeMutation['_id'])
                    .success(
                        function (p_oResponseData, p_oResponseStatus, p_oResonseHeaders, p_cfgResponse)
                        {
                            if (p_oResponseStatus) {
                                l_oEventToEdit.mf_goBack();
                            }

                        }
                    )
            };

            $http.get(l_strApiUrlPath + $routeParams.id)
                .success(
                    function (p_oResponseData)
                    {
                        l_oEventToEdit.m_oEventBeforeMutation = p_oResponseData;
                        l_oEventToEdit.m_strEventName         = p_oResponseData.name;
                        l_oEventToEdit.m_strDatetimeOfEvent   = new Date(p_oResponseData.time);
                    }
                );
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
                ).when("/edit/:id", {
                    templateUrl:  '../view/event-edit.html',
                    controller:   'editEventController',
                    controllerAs: 'editEvent'
                }
            )
        }
    );
