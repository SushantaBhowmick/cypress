/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        // domains:['wjezhnezszbacbkgxswr.supabase.co'],
        remotePatterns:[
            {
                protocol:"https",
                hostname:"wjezhnezszbacbkgxswr.supabase.co",
                pathname:"**"
            }
        ]
    }
}

module.exports = nextConfig
