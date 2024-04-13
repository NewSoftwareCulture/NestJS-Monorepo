# Simple CI/CD crontab agent

## Crontab

#### Add agent to user crontab
```
crontab -u $USER -l | grep -v '/home/$USER/workspace/nestjs_monorepo/ci-cd-agent/run-agent.sh'  | crontab -u $USER -
```

#### Crontab list by user
```
crontab -u $USER -l
```

#### Crontab logs
```
grep CRON /var/log/syslog
```

#### Agent logs
```
tail -f /tmp/logs/ci-cd-agent.log
```
