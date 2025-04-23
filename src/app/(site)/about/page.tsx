import { Card, CardContent } from "@/components/ui/card";
  import { Avatar, AvatarFallback } from "@/components/ui/avatar";
  import { Separator } from "@/components/ui/separator";
  
  const teamMembers = [
    { name: "Sushanta Bhowmick", initials: "SB" },
    { name: "Sayan Manna", initials: "SM" },
    { name: "Sumangal Dey", initials: "SD" },
    { name: "Saptarshi Sharma", initials: "SS" },
  ];

const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
    <h1 className="text-4xl font-bold mb-4 text-center">About Us</h1>
    <p className="text-lg text-gray-700 mb-8 text-center">
      We are a passionate group of final-year students building a real-time collaborative workspace platform—something like Jira, but more seamless and intuitive. Our mission is to enhance productivity through real-time collaboration, smooth task management, and a beautiful user experience.
    </p>

    <Separator className="my-6" />

    <h2 className="text-2xl font-semibold mb-4 text-center">Meet the Team</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {teamMembers.map((member, index) => (
        <Card key={index} className="rounded-2xl shadow-md hover:shadow-xl transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <Avatar className="h-14 w-14">
              <AvatarFallback>{member.initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-medium">{member.name}</h3>
              <p className="text-sm text-gray-600">Full Stack Developer</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <Separator className="my-6" />

    <div className="text-center text-gray-600 text-sm">
      Built with ❤️ using Next.js, Tailwind CSS, ShadCN UI, Supabase, and Socket.IO
    </div>
  </div>
  )
}

export default About
