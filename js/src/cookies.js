const cookies = {
  set: (key, value = 1) => {
    document.cookie = key + '=' + value ;
  },
  get: (key) => {
    const keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
  }
};
