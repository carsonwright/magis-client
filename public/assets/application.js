
var Application, application;

Application = (function() {
  function Application() {}

  Application.prototype.request = function(method, path, data) {
    return $.ajax({
      url: path,
      method: method,
      crossDomain: true,
      data: data,
      error: function() {
        alert('Error');
      }
    });
  };

  Application.prototype.get = function(path) {
    return this.request("GET", path);
  };

  Application.prototype.post = function(path, data) {
    return this.request("POST", path, data);
  };

  return Application;

})();

application = new Application;
