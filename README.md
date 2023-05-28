# client-cert-test

![language](https://img.shields.io/github/languages/top/onemarcfifty/client-cert-test)    ![License](https://img.shields.io/github/license/onemarcfifty/client-cert-test)    ![Last Commit](https://img.shields.io/github/last-commit/onemarcfifty/client-cert-test)     ![FileCount](https://img.shields.io/github/directory-file-count/onemarcfifty/client-cert-test)    ![Stars](https://img.shields.io/github/stars/onemarcfifty/client-cert-test)    ![Forks](https://img.shields.io/github/forks/onemarcfifty/client-cert-test)

a simple nodejs web server that is using X.509 client certificates

## How to install

Download the files from this repository, either by unzipping them into a directory or using git:

    git clone https://github.com/onemarcfifty/client-cert-test.git


For this you need nodejs (no modules required, it is just plain html code). On Debian you can install node with apt:

    sudo apt install nodejs


then cd into the new directory and run the server:

    cd client-cert-test
    node testserver.js

## How to use it

Now you can open a web browser and browse to the address of the nodejs app. Assuming that your server is called "testserver", browse to `https://testserver:8443/form` you will most probably get a certificate warning. In the `ca` subdirectory you can find a self-signed certificate authority (CA) that you can import into your browser. Alternatively - if you want to run this on a server with valid Let's encrypt certificates or the like, just replace the files `server.crt` and `server.key` with the certificate and private key of your "real" server. Don't replace the `ca.crt` file - it's used for client authentication!

The files `server.crt` and `server.key` in the `ca` subdirectory have been signed with the `ca.crt` for testing purposes. If you want to test without certificate warning, then you could just make an entry into your host file and point `testserver` to any host, for example your localhost by addding the following into your `/etc/hosts` file (on Linux) or your `C:\Windows\System32\drivers\etc\hosts` file (on Windows):

    127.0.0.1 localhost testserver

If you now browse to `https://testserver:8433/form`, then your browser should tell you that you have been rejected as you don't have the right client certificate installed. That's the purpose of this exercise ;-) - In order to gain access, you need to import the file `xca.db/testuser.p12` into your browser. The password for this is ***hello*** 

## How does this work

We are using X.509 client certificates and TLS (Transport Layer Security) for this. If you want to edit the certificates using **XCA** then get XCA installed from [Christian Hohnstaedt's site](https://hohnstaedt.de/xca) and open the file `xca.db/xca.xdb` - it contains all certificates. The password for the file again is ***hello***

## More Info

The whole process is described in [This video on my youtube channel](https://www.youtube.com/watch?v=5lYQRuzdZr0)