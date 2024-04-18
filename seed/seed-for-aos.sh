#!/bin/sh
# 3RSV5Iwvm-bipR3lwVbB3rMUgGUQ_mv9y3NZmGhHrTw ao-wallet.json
# 4enCMfzGIh-wTS9Y6cCxD5ftEENwHbfugeoucYZmVqY aos-module-publisher-wallet.json
# C6ENyRAYxI-wN4wOjm2oOA33UjTfkhFfTWOkHsmXP6E aos-wallet.json
# 5YkrFyX5EyGbVEp4z6DgIjMggxWS8tFkH1nYUESsriA bundler-wallet.json
# mOCc2rtenY0tX0L8x7lmnLW84UcZNqQMz3GTcTQ7PDY scheduler-location-publisher-wallet.json
# hPDUWhmITAXu9EVy0Qk1piPuTPekuxazJFNfmx1dn0A turbo-wallet.json
# 67CQ4aoOmiF2axZ9-99M9O_Fz7EeBKqZp6aBNp2PJ7s user-wallet.json


cd $(dirname $0)

#########################################################################################
# Mint/grant tokens

# # Give the Scheduler Location Publisher 1 AR
curl -q http://localhost:4000/mint/mOCc2rtenY0tX0L8x7lmnLW84UcZNqQMz3GTcTQ7PDY/1000000000000
echo
# # Give the `aos` Module Publisher 1 AR
curl -q http://localhost:4000/mint/4enCMfzGIh-wTS9Y6cCxD5ftEENwHbfugeoucYZmVqY/1000000000000
echo
# # Give the bundler service 1 AR
curl -q http://localhost:4000/mint/5YkrFyX5EyGbVEp4z6DgIjMggxWS8tFkH1nYUESsriA/1000000000000
echo
# # Give the `ao` units 1 AR
curl -q http://localhost:4000/mint/3RSV5Iwvm-bipR3lwVbB3rMUgGUQ_mv9y3NZmGhHrTw/1000000000000
echo

echo "!!!"
echo "!!!"
echo "!!!"
echo "!!! Edit this script to grant tokens to your wallet(s)."
echo "!!!"
echo "!!!"
echo "!!!"

#########################################################################################
# Publish the 'Scheduler-Location' record

./publish-scheduler-location.mjs
./mine.mjs

#########################################################################################
# Publish the `aos` Module

./publish-aos-module.mjs
echo
echo "copy this   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"
echo
./mine.mjs
