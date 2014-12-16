/** @jsx React.DOM */

jest.dontMock('../../../scripts/gebo/AuthenticateMenu');
jest.dontMock('../../../scripts/config');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils;

var AuthenticateMenu = require('../../../scripts/gebo/AuthenticateMenu'),
    getTokenByPopup = require('../../../scripts/gebo/getTokenByPopup'),
    logout = require('../../../scripts/gebo/logout'),
    verifyToken = require('../../../scripts/gebo/verifyToken');
    haiKeyKey = require('../../../scripts/config').name + '-key';

/**
 * For mocking localStorage
 * 
 * 2014-12-11
 * Courtesy of Martin Danielson
 * https://groups.google.com/forum/#!topic/jestjs/9EPhuNWVYTg
 */
var mock = (function() {
    var store = {};
     return {
        getItem: function(key) {
            return store[key];
        },
        setItem: function(key, value) {
            store[key] = value.toString();
        },
        clear: function() {
            store = {};
        }
    };
})();
Object.defineProperty(window, 'localStorage', { value: mock });

/**
 * React doesn't know about the CustomEvent document constructor.
 * All this nonsense is intended to circumvent that issue will
 * still enabling meaningful tests. C.f., 'CustomEvent = function(){};'
 * in the component script.
 */
window.dispatchEvent = jest.genMockFunction();

/**
 * AuthenticateMenu
 */
describe('AuthenticateMenu', function() {

    beforeEach(function() {
        localStorage.clear();
    });

    it('should correctly set the initial state', function() {
        var authenticate = TestUtils.renderIntoDocument(<AuthenticateMenu />);
        expect(authenticate.state.accessToken).toBe(undefined);
        expect(authenticate.state.name).toBe(null);
        expect(authenticate.state.verified).toBe(false);
    });

    it('should display the Login option if the user has not authenticated', function() {
        var authenticate = TestUtils.renderIntoDocument(<AuthenticateMenu />);
        var options = TestUtils.scryRenderedDOMComponentsWithTag(authenticate, 'li');
        expect(options.length).toEqual(1);
        expect(options[0].getDOMNode().textContent).toEqual('Login');
    });

    it('should display the Logout and Action options if the stored token has been verified', function() {
        localStorage.setItem(haiKeyKey, 'SomePseudoRandomAuthenticationKey');

        verifyToken.mockImplementation(function(token, done) {
            done(null, { name: 'Dan', admin: true });
          });

        var authenticate = TestUtils.renderIntoDocument(<AuthenticateMenu />);
        var options = TestUtils.scryRenderedDOMComponentsWithTag(authenticate, 'li');
        expect(options.length).toEqual(2);
        expect(options[0].getDOMNode().textContent).toEqual('Action');
        expect(options[1].getDOMNode().textContent).toEqual('Logout');
        verifyToken.mockClear();
    });

    it('should verify a stored token', function() {
        localStorage.setItem(haiKeyKey, 'SomePseudoRandomAuthenticationKey');

        var authenticate = TestUtils.renderIntoDocument(<AuthenticateMenu />);
        var options = TestUtils.scryRenderedDOMComponentsWithTag(authenticate, 'li');
        expect(verifyToken.mock.calls.length).toEqual(1);
        expect(verifyToken.mock.calls[0][0]).toEqual('SomePseudoRandomAuthenticationKey');
    });

    /**
     * componentDidMount
     */
    describe('componentDidMount', function() {

        beforeEach(function() {
            verifyToken.mockImplementation(function(token, done) {
                done(null, { name: 'Dan', admin: true });
              });
        });

        afterEach(function() {
            verifyToken.mockClear();
        });

        it('should add a message event listener to the window object', function() {
            var orig = window.addEventListener;
            window.addEventListener = jest.genMockFunction();
            var authenticate = TestUtils.renderIntoDocument(<AuthenticateMenu />);
            expect(window.addEventListener.mock.calls.length).toEqual(1);
    
            // Reset the funciton
            window.addEventListener = orig;
        });
    
        it('should verify a stored token', function() {
            localStorage.setItem(haiKeyKey, 'SomePseudoRandomAuthenticationKey');
    
            var authenticate = TestUtils.renderIntoDocument(<AuthenticateMenu />);
            var options = TestUtils.scryRenderedDOMComponentsWithTag(authenticate, 'li');
            expect(authenticate.state.accessToken).toEqual('SomePseudoRandomAuthenticationKey');
            expect(authenticate.state.name).toEqual('Dan');
            expect(authenticate.state.admin).toBe(true);
            expect(authenticate.state.verified).toBe(true);
        });

        /**
         * window message event
         */
        describe('window message event', function() {
            afterEach(function() {
                window._listeners.message = undefined
            });

            it('should verify the token', function() {
                var authenticate = TestUtils.renderIntoDocument(<AuthenticateMenu />);

                var event = { data : { access_token: 'SomePseudoRandomAuthenticationKey', type: 'bearer' } };
                window._listeners.message.false[0](event);

                expect(verifyToken.mock.calls.length).toEqual(1);
                expect(verifyToken.mock.calls[0][0]).toEqual('SomePseudoRandomAuthenticationKey');
            });

            it('should set any token received from the popup authentication dialog', function() {
                var authenticate = TestUtils.renderIntoDocument(<AuthenticateMenu />);
        //        console.log(Object.keys(window._listeners.message));
        //        console.log(window._listeners.message.false[2].toString());
        //        console.log(window._listeners.message.false);
        
                expect(localStorage.getItem(haiKeyKey)).toBe(undefined);
        
                var event = { data : { access_token: 'SomePseudoRandomAuthenticationKey', type: 'bearer' } };
                // Simulate a message being sent
                window._listeners.message.false[0](event);
        
                expect(localStorage.getItem(haiKeyKey)).toEqual('SomePseudoRandomAuthenticationKey');
                expect(authenticate.state.accessToken).toEqual('SomePseudoRandomAuthenticationKey');
            });
        
            it('should clear the token from localStorage if the popup authentication dialog sends nothing sensible', function() {
                var authenticate = TestUtils.renderIntoDocument(<AuthenticateMenu />);
        
                expect(localStorage.getItem(haiKeyKey)).toBe(undefined);
        
                var event = { data : { access_token: 'SomePseudoRandomAuthenticationKey', type: 'bearer' } };
                window._listeners.message.false[0](event);
        
                expect(localStorage.getItem(haiKeyKey)).toEqual('SomePseudoRandomAuthenticationKey');
        
                event = { data : { mangled_access_token: 'SomePseudoRandomAuthenticationKey', type: 'bearer' } };
                window._listeners.message.false[0](event);
        
                expect(localStorage.getItem(haiKeyKey)).toBe(undefined);
            });

            it('should set the user\'s name, verification status, and admin status', function() {
                var authenticate = TestUtils.renderIntoDocument(<AuthenticateMenu />);
        
                expect(localStorage.getItem(haiKeyKey)).toBe(undefined);
        
                var event = { data : { access_token: 'SomePseudoRandomAuthenticationKey', type: 'bearer' } };
                window._listeners.message.false[0](event);
 
                expect(authenticate.state.name).toEqual('Dan');
                expect(authenticate.state.admin).toBe(true);
                expect(authenticate.state.verified).toBe(true);
            });

            it('should reset the state if verification fails', function() {
                var authenticate = TestUtils.renderIntoDocument(<AuthenticateMenu />);

                verifyToken.mockImplementation(function(token, done) {
                  done('You couldn\'t be verified');
                });

                expect(localStorage.getItem(haiKeyKey)).toBe(undefined);
        
                var event = { data : { access_token: 'SomePseudoRandomAuthenticationKey', type: 'bearer' } };
                window._listeners.message.false[0](event);
 
                expect(authenticate.state.accessToken).toBe(undefined);
                expect(authenticate.state.name).toBe(null);
                expect(authenticate.state.admin).toBe(false);
                expect(authenticate.state.verified).toBe(false);
            });

            it('should emit a \'verified\' event if verification succeeds', function() {
                var authenticate = TestUtils.renderIntoDocument(<AuthenticateMenu />);

                var event = { data : { access_token: 'SomePseudoRandomAuthenticationKey', type: 'bearer' } };
                window._listeners.message.false[0](event);
 
                expect(window.dispatchEvent.mock.calls.length).toEqual(1);
                var expectedParam = {
                        detail: {
                            accessToken: 'SomePseudoRandomAuthenticationKey',
                            name: 'Dan',
                            admin: true,
                            verified: true,
                        }
                    };
                expect(window.dispatchEvent).toBeCalledWith(expectedParam);
            });

            it('should emit a \'verified\' event if verification fails', function() {
                var authenticate = TestUtils.renderIntoDocument(<AuthenticateMenu />);

                verifyToken.mockImplementation(function(token, done) {
                  done('You couldn\'t be verified');
                });

                var event = { data : { access_token: 'SomePseudoRandomAuthenticationKey', type: 'bearer' } };
                window._listeners.message.false[0](event);
 
                expect(window.dispatchEvent.mock.calls.length).toEqual(1);
                var expectedParam = {
                        detail: {
                            accessToken: undefined ,
                            name: null,
                            admin: false,
                            verified: false,
                        }
                    };
                expect(window.dispatchEvent).toBeCalledWith(expectedParam);
            });

            it('should emit a \'verified\' event if no access_token attached to the message', function() {
                var authenticate = TestUtils.renderIntoDocument(<AuthenticateMenu />);

                var event = { data : { mangled_access_token: 'SomePseudoRandomAuthenticationKey', type: 'bearer' } };
                window._listeners.message.false[0](event);
 
                expect(window.dispatchEvent.mock.calls.length).toEqual(1);
                var expectedParam = {
                        detail: {
                            accessToken: undefined,
                            name: null,
                            admin: false,
                            verified: false,
                        }
                    };
                expect(window.dispatchEvent).toBeCalledWith(expectedParam);
            });
        });
    });

    /**
     * renderMenu
     */
    describe('renderMenu', function() {
        it('should display the Login option if the user has not authenticated', function() {
            var authenticate = TestUtils.renderIntoDocument(<AuthenticateMenu />);
            var ul = TestUtils.renderIntoDocument(authenticate.renderMenu());
            var options = TestUtils.scryRenderedDOMComponentsWithTag(ul, 'li');
            expect(options.length).toEqual(1);
            expect(options[0].getDOMNode().textContent).toEqual('Login');
        });

        it('should display the Action and Logout options if the token has been verified', function() {
            localStorage.setItem(haiKeyKey, 'SomePseudoRandomAuthenticationKey');
            var authenticate = TestUtils.renderIntoDocument(<AuthenticateMenu />);
            var ul = TestUtils.renderIntoDocument(authenticate.renderMenu());
            var options = TestUtils.scryRenderedDOMComponentsWithTag(ul, 'li');
            expect(options.length).toEqual(2);
            expect(options[0].getDOMNode().textContent).toEqual('Action');
            expect(options[1].getDOMNode().textContent).toEqual('Logout');
        });

        it('should set an onClick handler if specified in the config file', function() {
            var authenticate = TestUtils.renderIntoDocument(<AuthenticateMenu />);
            var ul = TestUtils.renderIntoDocument(authenticate.renderMenu());
            var options = TestUtils.scryRenderedDOMComponentsWithTag(ul, 'li');
            expect(options.length).toEqual(1);
            expect(options[0].getDOMNode().textContent).toEqual('Login');

            expect(getTokenByPopup.mock.calls.length).toEqual(0);
            var a = TestUtils.scryRenderedDOMComponentsWithTag(options[0], 'a');
            expect(a.length).toEqual(1);
            TestUtils.Simulate.click(a[0].getDOMNode());
            expect(getTokenByPopup.mock.calls.length).toEqual(1);
        });
    });

    /**
     * reset
     */
    describe('reset', function() {

        beforeEach(function() {
            logout.mockImplementation(function(done) {
                done();
              });
        });

        afterEach(function() {
            logout.mockClear();
        });

        it('should clear the token in local storage', function() {
            localStorage.setItem(haiKeyKey, 'SomePseudoRandomAuthenticationKey');
            var authenticate = TestUtils.renderIntoDocument(<AuthenticateMenu />);
            expect(localStorage.getItem(haiKeyKey)).toEqual('SomePseudoRandomAuthenticationKey');
            authenticate.reset();
            expect(localStorage.getItem(haiKeyKey)).toBe(undefined);
        });

        it('should reset the component\'s state', function() {
            localStorage.setItem(haiKeyKey, 'SomePseudoRandomAuthenticationKey');
            var authenticate = TestUtils.renderIntoDocument(<AuthenticateMenu />);
            expect(authenticate.state.accessToken).toEqual('SomePseudoRandomAuthenticationKey');
            authenticate.reset();
            expect(authenticate.state.accessToken).toBe(undefined);
            expect(authenticate.state.name).toBe(null);
            expect(authenticate.state.verified).toBe(false);
        });

        it('should call the logout function', function() {
            var authenticate = TestUtils.renderIntoDocument(<AuthenticateMenu />);
            authenticate.reset();
            expect(logout.mock.calls.length).toEqual(1);
        });
    });
});
