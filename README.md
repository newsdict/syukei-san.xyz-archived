# Start Development

    $ cp .env-sample .env
    $ SECRET=$(md5sum <(date +'%Y%m%d%H%I%m%S')  | awk '{print $1}'); sed -i "s/SECRET=.*$/SECRET=$SECRET/" .env
    $ docker-compose up --build