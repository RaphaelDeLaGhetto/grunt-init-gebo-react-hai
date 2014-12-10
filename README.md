grunt-init-gebo-react-hai
=========================

A gebo HAI template written in React.

This software, in conjunction with grunt-init, creates a ready-to-deploy/develop React gebo app preconfigured for OAuth2 authentication.

## Getting Started

### Setup grunt

```
sudo npm install grunt-cli -g
sudo npm install grunt-init -g
```

The first command enables you to run the grunt installed locally, automatically. The second allows you to call grunt-init on this template.

### Next, install the template

This is going in your `~/.grunt-init/` directory

```
git clone https://github.com/RaphaelDeLaGhetto/grunt-init-gebo-react-hai.git ~/.grunt-init/gebo-react-hai
```

### Create a new project:

```
mkdir mynewproject
cd mynewproject
grunt-init gebo-react-hai
sudo npm install
```

### Run your server

```
grunt server
```

and go to <http://localhost:9000>.

## Contributing

Hit me with it.

## License

MIT
