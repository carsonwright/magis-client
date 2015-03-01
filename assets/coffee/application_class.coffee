class Application
  request: (method, path, data)->
    $.ajax
      url: path
      method: method
      crossDomain: true
      data: data
      error: ->
        alert 'Error'
        return
  get: (path)->
    @request("GET", path)
  post: (path, data)->
    @request("POST", path, data)

application = new Application
