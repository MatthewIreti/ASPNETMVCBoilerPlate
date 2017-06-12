using System;
using System.Configuration;
using System.IO;
using System.Net;
using System.Text;
using System.Web;
using Newtonsoft.Json;

namespace BoilerPlate.Providers
{
    public class InWebRequest
    {
        private static WebRequest _request;
            private static Stream _dataStream;


            public static string GetResponse(string url)
            {
                return GetResponse(url, null);
            }

            public static string GetResponse(string url, string baseUrl)
            {
                return GetResponse(url, baseUrl, null);

            }

            public static string GetResponse(string url, string baseUrl, string method)
            {
                return GetResponse(url, baseUrl, method, null);

            }

            public static string GetResponse(string url, string baseUrl, string method, object data)
            {

                 
                string baseUrl1 = baseUrl ?? ("http://" + HttpContext.Current.Request.Url.Authority);
                _request = WebRequest.Create(baseUrl1 + url);

                _request.Method = method ?? "Get";

                var token = HttpContext.Current.Request.Cookies["token"];
                if (token != null)
                    _request.Headers.Add("Authorization",
                        "Bearer " + token.Value);

                byte[] byteArray = new byte[0];
                if (data != null)
                {
                    string postData = JsonConvert.SerializeObject(data);
                    byteArray = Encoding.UTF8.GetBytes(postData);
                    _request.ContentType = "application/json";
                    _request.ContentLength = byteArray.Length;


                    _dataStream = _request.GetRequestStream();

                    _dataStream.Write(byteArray, 0, byteArray.Length);

                    _dataStream.Close();
                }


                return GetResponse();
            }


            private static string GetResponse()
            {
                // Get the original response.
                WebResponse response = _request.GetResponse();

                if (((HttpWebResponse)response).StatusCode != HttpStatusCode.OK)
                    throw new Exception();

                // Get the stream containing all content returned by the requested server.
                _dataStream = response.GetResponseStream();

                // Open the stream using a StreamReader for easy access.
                var reader = new StreamReader(_dataStream);

                // Read the content fully up to the end.
                string responseFromServer = reader.ReadToEnd();

                // Clean up the streams.
                reader.Close();
                _dataStream.Close();
                response.Close();

                return responseFromServer;
            }

         
    }
}