

# Change this to your URL
$domain = "http://u3admin.org.au"

# file extensions to include in index
$extensions = ".htm", ".html", ".pdf",".xml"

# index now
$bingUrl = 'https://bing.com/indexnow'
$key = 'd984acf80a6c4be4b4d51b243dfe1561'

# wrap file information in XML tags
function requestIndex
{
    begin
    {
    }

    process
    {
        if ($extensions -contains $_.extension )
        {
            $encodedName = [System.Web.HttpUtility]::UrlEncode($_.name)
            $url = "${bingUrl}?url=${domain}/$($encodedName)&key=${key}&keyLocation=${domain}/${key}.txt"
            Write-Output $encodedName
            $resp = Invoke-WebRequest -URI $url
            Write-Output $resp.StatusDescription
        }
    }

    end
    {
    }
}

Get-ChildItem | requestIndex 
