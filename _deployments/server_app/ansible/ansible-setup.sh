#!/bin/bash

# Sends a message.
function set_message {
  echo ''
  echo '======================================================================='
  echo "$1"
}

# Logs a message.
function set_log {
  echo "$1"
}


home=`pwd`

set_message "Setting up Ansible..."

# Install ansible.
set_log 'Adding repositories...'
add-apt-repository ppa:rquillo/ansible
set_log 'Updating apt...'
apt-get update
set_log 'Installing Ansible...'
apt-get install ansible

# Run the playbook.
set_log 'Running Ansible playbooks...'
ansible-playbook -K server.yml

# Tell the user that we are done!
set_message 'Success!'
