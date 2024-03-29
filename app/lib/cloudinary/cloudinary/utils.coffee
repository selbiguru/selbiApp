_ = require("../underscore")
config = require("./config")

exports.CF_SHARED_CDN = "d3jpl91pxevbkh.cloudfront.net";
exports.OLD_AKAMAI_SHARED_CDN = "cloudinary-a.akamaihd.net";
exports.AKAMAI_SHARED_CDN = "res.cloudinary.com";
exports.SHARED_CDN = exports.AKAMAI_SHARED_CDN;

exports.timestamp = ->
  Math.floor(new Date().getTime()/1000)

exports.option_consume = option_consume = (options, option_name, default_value) ->
  result = options[option_name]
  delete options[option_name]

  if result? then result else default_value

exports.build_array = build_array = (arg) ->
  if !arg?
    []
  else if _.isArray(arg)
    arg 
  else 
    [arg]

exports.present = present = (value) ->
  not _.isUndefined(value) and ("" + value).length > 0

exports.generate_transformation_string = generate_transformation_string = (options) ->
  if _.isArray(options)
    result = for base_transformation in options
      generate_transformation_string(_.clone(base_transformation))
    return result.join("/")

  width = options["width"]
  height = options["height"]
  size = option_consume(options, "size")
  [options["width"], options["height"]] = [width, height] = size.split("x") if size

  has_layer = options.overlay or options.underlay
  crop = option_consume(options, "crop")
  angle = build_array(option_consume(options, "angle")).join(".")
  no_html_sizes = has_layer or present(angle) or crop == "fit" or crop == "limit"

  delete options["width"] if width and (no_html_sizes or parseFloat(width) < 1)
  delete options["height"] if height and (no_html_sizes or parseFloat(height) < 1)
  background = option_consume(options, "background")
  background = background and background.replace(/^#/, "rgb:")
  base_transformations = build_array(option_consume(options, "transformation", []))
  named_transformation = []
  if _.filter(base_transformations, _.isObject).length > 0
    base_transformations = _.map(base_transformations, (base_transformation) ->
      if _.isObject(base_transformation) 
        generate_transformation_string(_.clone(base_transformation)) 
      else 
        generate_transformation_string(transformation: base_transformation)
    )
  else
    named_transformation = base_transformations.join(".")
    base_transformations = []
  effect = option_consume(options, "effect")
  effect = effect.join(":") if _.isArray(effect)

  border = option_consume(options, "border")
  if _.isObject(border)
    border = "#{border.width ? 2}px_solid_#{(border.color ? "black").replace(/^#/, 'rgb:')}"
  flags = build_array(option_consume(options, "flags")).join(".")

  params =
    c: crop
    t: named_transformation
    w: width
    h: height
    b: background
    e: effect
    a: angle
    bo: border
    fl: flags

  simple_params =
    x: "x"
    y: "y"
    radius: "r"
    gravity: "g"
    quality: "q"
    prefix: "p"
    default_image: "d"
    underlay: "u"
    overlay: "l"
    fetch_format: "f"
    density: "dn"
    page: "pg"
    color_space: "cs"
    delay: "dl"
    opacity: "o"

  for param, short of simple_params
    params[short] = option_consume(options, param)

  params = _.sortBy([key, value] for key, value of params, (key, value) -> key)

  params.push [option_consume(options, "raw_transformation")]
  transformation = (param.join("_") for param in params when present(_.last(param))).join(",")

  base_transformations.push transformation
  _.filter(base_transformations, present).join "/"

exports.url = cloudinary_url = (public_id, options = {}) ->
  type = option_consume(options, "type", "upload")
  options.fetch_format ?= option_consume(options, "format") if type is "fetch"
  transformation = generate_transformation_string(options)
  resource_type = option_consume(options, "resource_type", "image")
  version = option_consume(options, "version")
  format = option_consume(options, "format")
  cloud_name = option_consume(options, "cloud_name", Alloy.CFG.cloudinary.cloudName)
  throw new Error("Unknown cloud_name") unless cloud_name
  private_cdn = option_consume(options, "private_cdn", config().private_cdn)
  secure_distribution = option_consume(options, "secure_distribution", config().secure_distribution)
  secure = option_consume(options, "secure", config().secure)
  cdn_subdomain = option_consume(options, "cdn_subdomain", config().cdn_subdomain)
  cname = option_consume(options, "cname", config().cname)
  shorten = option_consume(options, "shorten", config().shorten)

  if public_id.match(/^https?:/)
    return public_id if type is "upload" or type is "asset"
    public_id = encodeURIComponent(public_id).replace(/%3A/g, ":").replace(/%2F/g, "/") 
  else 
    public_id = encodeURIComponent(decodeURIComponent(public_id)).replace(/%3A/g, ":").replace(/%2F/g, "/")
    public_id += "." + format if format  

  shared_domain = !private_cdn
  if secure        
    if !secure_distribution || secure_distribution == exports.OLD_AKAMAI_SHARED_CDN
      secure_distribution = (if private_cdn then "#{cloud_name}-res.cloudinary.com" else exports.SHARED_CDN)
    shared_domain ||= secure_distribution == exports.SHARED_CDN
    prefix = "https://#{secure_distribution}"
  else
    subdomain = (if cdn_subdomain then "a#{(crc32(public_id) % 5) + 1}." else "")
    host = cname ? "#{if private_cdn then "#{cloud_name}-" else ""}res.cloudinary.com"
    prefix = "http://#{subdomain}#{host}"
  prefix += "/#{cloud_name}" if shared_domain

  if shorten && resource_type == "image" && type == "upload"
    resource_type = "iu"
    type = undefined

  version ?= 1 if public_id.search("/") >= 0 && !public_id.match(/^v[0-9]+/) && !public_id.match(/^https?:\//)
  
  url = [ prefix, resource_type, type, transformation, (if version then "v" + version else ""), public_id ].join("/")
  url.replace(/([^:])\/+/g, "$1/")

html_only_attributes = (options) ->
  width = option_consume(options, "html_width")
  height = option_consume(options, "html_height")
  options["width"] = width if width
  options["height"] = height if height

# http://kevin.vanzonneveld.net
# +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
# +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
# +   improved by: sowberry
# +    tweaked by: Jack
# +   bugfixed by: Onno Marsman
# +   improved by: Yves Sucaet
# +   bugfixed by: Onno Marsman
# +   bugfixed by: Ulrich
# +   bugfixed by: Rafal Kukawski
# +   improved by: kirilloid
# *     example 1: utf8_encode('Kevin van Zonneveld');
# *     returns 1: 'Kevin van Zonneveld'
utf8_encode = (argString) ->
  return "" unless argString?
  string = (argString + "")
  utftext = ""
  start = undefined
  end = undefined
  stringl = 0
  start = end = 0
  stringl = string.length
  n = 0

  while n < stringl
    c1 = string.charCodeAt(n)
    enc = null
    if c1 < 128
      end++
    else if c1 > 127 and c1 < 2048
      enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128)
    else
      enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128)
    if enc isnt null
      utftext += string.slice(start, end)  if end > start
      utftext += enc
      start = end = n + 1
    n++
  utftext += string.slice(start, stringl)  if end > start
  utftext

# http://kevin.vanzonneveld.net
# +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
# +   improved by: T0bsn
# +   improved by: http://stackoverflow.com/questions/2647935/javascript-crc32-function-and-php-crc32-not-matching
# -    depends on: utf8_encode
# *     example 1: crc32('Kevin van Zonneveld');
# *     returns 1: 1249991249
crc32 = (str) ->
  str = utf8_encode(str)
  table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D"
  crc = 0
  x = 0
  y = 0
  crc = crc ^ (-1)
  i = 0
  iTop = str.length

  while i < iTop
    y = (crc ^ str.charCodeAt(i)) & 0xFF
    x = "0x" + table.substr(y * 9, 8)
    crc = (crc >>> 8) ^ x
    i++
  crc = crc ^ (-1)
  crc += 4294967296  if crc < 0
  crc

exports.api_url = (action = 'upload', options = {}) ->
  cloudinary = options["upload_prefix"] ? config().upload_prefix ? "https://api.cloudinary.com"
  cloud_name = options["cloud_name"] ? Alloy.CFG.cloudinary.cloudName ? throw new Error("Must supply cloud_name")
  resource_type = options["resource_type"] ? "image"
  return [cloudinary, "v1_1", cloud_name, resource_type, action].join("/")

exports.random_public_id = ->
  generate_strip = (first, last) ->
    _.reduce _.range(first.charCodeAt(0), last.charCodeAt(0)+1), (memo, charCode) ->
      memo + String.fromCharCode(charCode)
    , ''
  strip = generate_strip('a', 'z') + generate_strip('0', '9')
  public_id = ''
  _.times 12, ->
    public_id += strip[_.random(strip.length - 1)]
  public_id

exports.signed_preloaded_image = (result) ->
  "#{result.resource_type}/upload/v#{result.version}/#{_.filter([result.public_id, result.format], present).join(".")}##{result.signature}"

exports.api_sign_request = (params_to_sign, api_secret) ->
  to_sign = _.sortBy("#{k}=#{build_array(v).join(",")}" for k, v of params_to_sign when v, _.identity).join("&")
  Ti.Utils.sha1(to_sign + api_secret)

exports.sign_request = (params, options) ->
  api_key = options.api_key ? Alloy.CFG.cloudinary.apikey ? throw("Must supply api_key")
  api_secret = options.api_secret ? config().api_secret ? throw("Must supply api_secret")
  # Remove blank parameters
  for k, v of params when not exports.present(v)
    delete params[k]
    
  params.signature = exports.api_sign_request(params, api_secret)
  params.api_key = api_key

  return exports.api_url("download", options) + "?" + exports.querystring.stringify(params)

exports.zip_download_url = (tag, options = {}) ->
  params = exports.sign_request({
    timestamp: exports.timestamp(), 
    tag: tag,
    transformation: exports.generate_transformation_string(options)
  }, options)

  return exports.api_url("download_tag.zip", options) + "?" + exports.querystring.stringify(params)

exports.html_attrs = (options) ->
  keys = _.sortBy(_.keys(options), _.identity)
  ("#{key}='#{options[key]}'" for key in keys when present(options[key])).join(" ")

exports.querystring =
  stringify: (obj) ->
    ("#{encodeURIComponent(key)}='#{encodeURIComponent(obj[key])}'" for key in _.keys(obj) when present(obj[key])).join("&")
