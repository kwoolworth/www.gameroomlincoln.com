require 'rubygems'
require 'compass'
require 'sinatra'

# Configure
configure do

	# Configure Compass
	Compass.configuration do |config|
		config.environment = Sinatra::Application.environment
		config.output_style = :compressed
	end

	# Configure Sinatra
	set :views,		File.join(Sinatra::Application.root, 'views')
	set :haml,		{:format => :html5 }
	set :sass, Compass.sass_engine_options

end

# Index
get '/' do
	haml :gameroomlincoln
end

# SASS stylesheet
get '/css/:name.css' do
	content_type 'text/css', :charset => 'utf-8'
	sass :"#{params[:name]}", {:views => File.join(Sinatra::Application.root, 'stylesheets')}
end

# Handle bad page requests
not_found do
	haml :gameroomlincoln
end