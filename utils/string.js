export function truncate(target, maxLength) {
  if (target.length > maxLength) {
    return target.slice(0, maxLength) + '...';
  }

  return target;
}

export function merge(...args) {
  return args.join(' ');
}
