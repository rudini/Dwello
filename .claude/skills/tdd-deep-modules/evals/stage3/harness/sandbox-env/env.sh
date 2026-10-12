# Sourced by every shell a sandboxed session starts (BASH_ENV, ENV): commands get no network proxy and git
# only local repositories. The session's own API connection is not affected.
unset HTTPS_PROXY https_proxy HTTP_PROXY http_proxy ALL_PROXY all_proxy NO_PROXY no_proxy
export GIT_ALLOW_PROTOCOL=file GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1 GIT_TERMINAL_PROMPT=0
