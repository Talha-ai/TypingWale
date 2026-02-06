import { useNavigate } from 'react-router-dom';
import {
  Keyboard,
  GraduationCap,
  Target,
  Trophy,
  Clock,
  TrendingUp,
  ChevronRight,
  Settings,
  BookOpen,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/theme-provider';
import { useKeyboardLayout } from '@/contexts/KeyboardLayoutContext';
// Auth disabled - using local user data
// import { useSession, useLogout } from '@/hooks/useAuth';

// Typing modes
const typingModes = [
  {
    id: 'tutor',
    name: 'Tutor Mode',
    description: 'Step-by-step guided lessons (35 lessons)',
    icon: GraduationCap,
    color: 'bg-blue-500',
    path: '/practice/tutor/1',
    lessons: '0/35',
  },
  {
    id: 'practice',
    name: 'Practice Mode',
    description: 'Free typing at your pace',
    icon: Target,
    color: 'bg-green-500',
    path: '/practice/free',
    lessons: '',
  },
  {
    id: 'test',
    name: 'Test Mode',
    description: 'CPCT-style timed tests',
    icon: Trophy,
    color: 'bg-orange-500',
    path: '/test',
    lessons: '',
  },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const {
    currentLayoutId,
    setLayout: setKeyboardLayout,
    availableLayouts,
  } = useKeyboardLayout();
  // Auth disabled - using default user
  const user = {
    fullName: 'Student',
    email: '',
    subscriptionStatus: 'active' as const,
  };

  // Mock stats
  const stats = {
    totalPracticeTime: '12h 30m',
    averageWPM: 28,
    accuracy: 94,
    lessonsCompleted: 8,
    totalLessons: 30,
  };

  const handleStartPractice = (mode: (typeof typingModes)[0]) => {
    navigate(mode.path);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Keyboard className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">TypingWale</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle + Settings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={user.fullName} />
                    <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">TypingWale</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme}>
                  {theme === 'dark' ? (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      Dark Mode
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6">
          {/* Welcome + Quick Actions Row */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {user.fullName.split(' ')[0]}!
              </h1>
              <p className="text-sm text-muted-foreground">
                Continue your Hindi typing journey
              </p>
            </div>
          </div>

          {/* Continue Last Lesson + Daily Challenge */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-0.5">
                      Continue Last Lesson
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Lesson 9: Advanced Matras
                    </p>
                  </div>
                  <Button size="sm" onClick={() => navigate('/practice/tutor/1')}>
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-background border-orange-500/20">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-0.5">Daily Challenge</h3>
                    <p className="text-xs text-muted-foreground">
                      Type 500 words today
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate('/practice/free')}
                  >
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Grid: Progress + Modes */}
          <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
            {/* Left Column: Typing Modes */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Choose Your Mode</h2>
              <div className="grid gap-4">
                {typingModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <Card
                      key={mode.id}
                      className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 group"
                      onClick={() => handleStartPractice(mode)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl ${mode.color} flex items-center justify-center shrink-0`}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold">{mode.name}</h3>
                              {mode.lessons && (
                                <Badge variant="secondary" className="text-xs">
                                  {mode.lessons} Lessons
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {mode.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            {/* Layout Selector Dropdown */}
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2"
                                >
                                  {/* <span className="text-base mb-0.5">
                                      {
                                        keyboardLayouts.find(
                                          (l) => l.id === selectedLayout
                                        )?.icon
                                      }
                                    </span> */}
                                  {availableLayouts[currentLayoutId]?.name}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                  Keyboard Layout
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {Object.entries(availableLayouts).map(
                                  ([id, layout]) => (
                                    <DropdownMenuItem
                                      key={id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setKeyboardLayout(
                                          id as typeof currentLayoutId,
                                        );
                                      }}
                                      className={
                                        currentLayoutId === id
                                          ? 'bg-accent'
                                          : ''
                                      }
                                    >
                                      {layout.name}
                                    </DropdownMenuItem>
                                  ),
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>

                            <Button size="sm">
                              Start
                              <ChevronRight className="mt-0.5 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Progress & Stats */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Your Progress</h2>

              {/* Progress Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Course Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Lessons Completed
                      </span>
                      <span className="font-medium">
                        {stats.lessonsCompleted}/{stats.totalLessons}
                      </span>
                    </div>
                    <Progress
                      value={
                        (stats.lessonsCompleted / stats.totalLessons) * 100
                      }
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {Math.round(
                        (stats.lessonsCompleted / stats.totalLessons) * 100,
                      )}
                      % complete
                    </p>
                  </div>

                  {/* Mini Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          Practice Time
                        </p>
                      </div>
                      <p className="text-lg font-bold">
                        {stats.totalPracticeTime}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Avg WPM</p>
                      </div>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {stats.averageWPM}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Target className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          Accuracy
                        </p>
                      </div>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {stats.accuracy}%
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Streak</p>
                      </div>
                      <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        5 days
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
