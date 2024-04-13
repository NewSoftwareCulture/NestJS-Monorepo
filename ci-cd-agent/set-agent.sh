PATH_SCRIPT=$(pwd)/ci-cd-agent/run-agent.sh
echo "CI/CD Agent script path: $PATH_SCRIPT"

chmod +x $PATH_SCRIPT
(crontab -u $USER -l; echo "0 0 * * * $PATH_SCRIPT >> /tmp/logs/ci-cd-agent.log 2>&1") | sort -u | crontab -