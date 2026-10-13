#!/bin/sh
# Exclude memory mappings even on systemd versions that ignore CoredumpFilter.
# This must run in the same process lineage as Node, before any private input.
set -eu
test "$#" -gt 0
printf '0\n' > /proc/self/coredump_filter
IFS= read -r ask_core_filter < /proc/self/coredump_filter
test "$ask_core_filter" = '00000000'
exec "$@"
