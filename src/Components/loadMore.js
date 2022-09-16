export default function loadMore(current) {
  if (
    window.innerHeight + document.documentElement.scrollTop + 300 >=
    document.scrollingElement.scrollHeight
  ) {
    return parseInt(current) + 1;
  } else {
    return null;
  }
}
