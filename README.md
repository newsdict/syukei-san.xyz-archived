# Prepare

    $ cp views/elements.user/head.sample.ejs views/elements.user/head.ejs
    $ cp views/elements.user/body.sample.ejs views/elements.user/body.ejs

# Start Development

    $ cp .env-sample .env
    $ SECRET=$(md5sum <(date +'%Y%m%d%H%I%m%S')  | awk '{print $1}'); sed -i "s/SECRET=.*$/SECRET=$SECRET/" .env
    $ docker/start
    
# Insert Tag Manager

Edit `views/elements.user/head.ejs` and `views/elements.user/body.ejs`