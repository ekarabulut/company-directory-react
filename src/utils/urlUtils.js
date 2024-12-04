export const getUrl = (endpoint, id = null) => {
    let baseUrl = `http://localhost:8080/company-directory-react/src/php`;
  
    if (window.location.href.match(/esramkarabulut/)) {
      baseUrl = `https://esramkarabulut.co.uk/company-directory-react/php`;
    }
  
  const url = id ? `${baseUrl}/${endpoint}/${id}` : `${baseUrl}/${endpoint}`;

  return url;
  
  };
  