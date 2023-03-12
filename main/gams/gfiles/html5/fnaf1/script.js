function inFrame () {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

if(!inFrame()) {
  window.location.replace("/g" + window.location.pathname.substring(5));
}
