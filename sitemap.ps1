# Change this to your URL
$domain = "http://u3admin.org.au"

# file extensions to include in sitemap
$extensions = ".htm", ".html", ".pdf"
$index = "index.html"

# wrap file information in XML tags
function wrap
{
    begin
    {
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        "`t<url>"
        "`t`t<loc>$domain/</loc>"
        "`t`t<lastmod>{0:s}Z</lastmod>" -f (get-date)
        "`t`t<priority>1.00</priority>"
        "`t</url>"
    }

    process
    {
        if ($extensions -contains $_.extension -and ($_.name -ne $index) )
        {
            Write-Host $_
        "`t<url>"
        "`t`t<loc>$domain/$_</loc>"
        "`t`t<lastmod>{0:s}Z</lastmod>" -f $_.LastWriteTimeUTC
        "`t`t<priority>0.00</priority>"
        "`t</url>"
        }
    }

    end
    {
        "</urlset>"
    }
}

Get-ChildItem | wrap | out-file -encoding ASCII sitemap.xml