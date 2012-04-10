require 'rubygems' if RUBY_VERSION < "1.9"
require 'sinatra'

set :public, File.dirname(__FILE__)

get '/' do
	File.read('Index.html')
end