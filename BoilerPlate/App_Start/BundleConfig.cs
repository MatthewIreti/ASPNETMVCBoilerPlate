using System.Web;
using System.Web.Optimization;

namespace BoilerPlate
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/waitMe.min.css",
                      "~/Content/site.css"));
          
            //Bundle the app folder
             bundles.Add(new ScriptBundle("~/bundles/app")
                      .IncludeDirectory("~/App", "*.js")
                       .IncludeDirectory("~/App/Resources", "*.js", true)
                       .IncludeDirectory("~/App/Services", "*.js", true)
                       .IncludeDirectory("~/App/common", "*.js", true)
                       .IncludeDirectory("~/App/Directives", "*.js", true)
                       .IncludeDirectory("~/App/Filters", "*.js", true)
            );
            //Separate Bundle for the Account App
             bundles.Add(new ScriptBundle("~/bundles/account")
                 .IncludeDirectory("~/App/account", "*.js", true)
            );
             //Separate Bundle for the site
             bundles.Add(new ScriptBundle("~/bundles/site")
               .IncludeDirectory("~/App/site", "*.js",true)
            );
             BundleTable.EnableOptimizations = true;
        }
    }
}
