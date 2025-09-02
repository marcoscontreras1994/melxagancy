import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Target, 
  TrendingUp, 
  Users, 
  Award,
  Star,
  Quote,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Shield,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  Edit,
  Trash2,
  Plus,
  Save,
  Eye,
  EyeOff,
  Download,
  Search,
  Filter,
  LogOut,
  BarChart3,
  FileText,
  HelpCircle,
  CreditCard,
  MessageSquare,
  Briefcase,
  Camera,
  Laptop
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  status: 'nuevo' | 'contactado' | 'convertido' | 'descartado';
  date: string;
}

interface PlanRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  plan: 'basico' | 'intermedio' | 'avanzado';
  message: string;
  status: 'nuevo' | 'contactado' | 'convertido' | 'descartado';
  date: string;
}

interface ServiceRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
  status: 'nuevo' | 'contactado' | 'convertido' | 'descartado';
  date: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  status: 'published' | 'draft';
  date: string;
  author: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  photo: string;
  bio: string;
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [activeTab, setActiveTab] = useState('leads');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basico' | 'intermedio' | 'avanzado' | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);

  // Estados para formularios
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [contactForm, setContactForm] = useState({
    name: '', email: '', phone: '', company: '', message: ''
  });
  const [planForm, setPlanForm] = useState({
    name: '', email: '', phone: '', company: '', message: ''
  });
  const [serviceForm, setServiceForm] = useState({
    name: '', email: '', phone: '', company: '', service: '', budget: '', timeline: '', message: ''
  });

  // Estados para datos
  const [leads, setLeads] = useState<Lead[]>([]);
  const [planRequests, setPlanRequests] = useState<PlanRequest[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'Daniel Gonzalez Esquerra',
      role: 'CEO and trafficker digital Melxagency',
      image: '/Daniel Imagen ok.jpeg',
      bio: 'Visionario líder con más de 10 años de experiencia en marketing digital y estrategias de crecimiento. Daniel ha transformado numerosas empresas a través de campañas innovadoras y un enfoque centrado en resultados. Su pasión por la tecnología y el marketing lo convierte en el motor impulsor de MelxAgency, siempre buscando nuevas formas de conectar marcas con sus audiencias de manera auténtica y efectiva.'
    }
  ]);

  // Estados para modales de administración
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [editingTeam, setEditingTeam] = useState<TeamMember | null>(null);

  // Formularios de administración
  const [blogForm, setBlogForm] = useState({
    title: '', content: '', category: '', status: 'draft' as 'published' | 'draft', author: ''
  });
  const [faqForm, setFaqForm] = useState({
    question: '', answer: '', category: '', order: 0
  });
  const [teamForm, setTeamForm] = useState({
    firstName: '', lastName: '', specialty: '', photo: '', bio: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Filtros
  const [leadFilter, setLeadFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const slides = [
    {
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "Estrategias de Marketing Digital",
      subtitle: "Nuestro equipo desarrolla campañas personalizadas para maximizar tu ROI"
    },
    {
      image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "Análisis y Optimización",
      subtitle: "Utilizamos datos avanzados para optimizar cada campaña publicitaria"
    },
    {
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "Resultados Medibles",
      subtitle: "Transformamos tu inversión publicitaria en crecimiento sostenible"
    }
  ];

  // Cargar datos del localStorage
  useEffect(() => {
    const savedLeads = localStorage.getItem('melxagency_leads');
    const savedPlanRequests = localStorage.getItem('melxagency_plan_requests');
    const savedServiceRequests = localStorage.getItem('melxagency_service_requests');
    const savedBlogPosts = localStorage.getItem('melxagency_blog_posts');
    const savedFaqs = localStorage.getItem('melxagency_faqs');
    const savedTeamMembers = localStorage.getItem('melxagency_team_members');

    if (savedLeads) setLeads(JSON.parse(savedLeads));
    if (savedPlanRequests) setPlanRequests(JSON.parse(savedPlanRequests));
    if (savedServiceRequests) setServiceRequests(JSON.parse(savedServiceRequests));
    if (savedBlogPosts) setBlogPosts(JSON.parse(savedBlogPosts));
    if (savedFaqs) {
      setFaqs(JSON.parse(savedFaqs));
    } else {
      // FAQs predeterminadas
      const defaultFaqs: FAQ[] = [
        {
          id: '1',
          question: '¿Cuánto tiempo toma ver resultados en las campañas?',
          answer: 'Generalmente comenzamos a ver resultados iniciales en las primeras 2-3 semanas. Los resultados óptimos se alcanzan entre 1-3 meses dependiendo del tipo de campaña y objetivos.',
          category: 'Resultados',
          order: 1
        },
        {
          id: '2',
          question: '¿Qué incluye el servicio de gestión de redes sociales?',
          answer: 'Incluye creación de contenido, programación de publicaciones, gestión de comunidad, respuesta a comentarios, análisis de métricas y reportes mensuales.',
          category: 'Servicios',
          order: 2
        },
        {
          id: '3',
          question: '¿Puedo cambiar de plan durante el servicio?',
          answer: 'Sí, puedes actualizar o cambiar tu plan en cualquier momento. Los cambios se aplican en el siguiente ciclo de facturación.',
          category: 'Planes',
          order: 3
        },
        {
          id: '4',
          question: '¿Ofrecen garantía en sus servicios?',
          answer: 'Ofrecemos garantía de satisfacción. Si no estás conforme con los resultados en los primeros 30 días, trabajamos contigo para ajustar la estrategia sin costo adicional.',
          category: 'Garantías',
          order: 4
        }
      ];
      setFaqs(defaultFaqs);
      localStorage.setItem('melxagency_faqs', JSON.stringify(defaultFaqs));
    }

    if (savedTeamMembers) {
      setTeamMembers(JSON.parse(savedTeamMembers));
    } else {
      // Equipo predeterminado
      const defaultTeam: TeamMember[] = [
        {
          id: '1',
          firstName: 'Carlos',
          lastName: 'Rodríguez',
          specialty: 'Director de Marketing Digital',
          photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
          bio: 'Especialista en estrategias digitales con más de 8 años de experiencia en campañas de alto impacto.'
        },
        {
          id: '2',
          firstName: 'Ana',
          lastName: 'Martínez',
          specialty: 'Especialista en Meta Ads',
          photo: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400',
          bio: 'Experta en publicidad en Facebook e Instagram con certificaciones oficiales de Meta.'
        },
        {
          id: '3',
          firstName: 'Miguel',
          lastName: 'Torres',
          specialty: 'Analista de Datos',
          photo: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400',
          bio: 'Especialista en análisis de métricas y optimización de campañas basada en datos.'
        }
      ];
      setTeamMembers(defaultTeam);
      localStorage.setItem('melxagency_team_members', JSON.stringify(defaultTeam));
    }
  }, []);

  // Carrusel automático
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Guardar datos en localStorage
  useEffect(() => {
    localStorage.setItem('melxagency_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('melxagency_plan_requests', JSON.stringify(planRequests));
  }, [planRequests]);

  useEffect(() => {
    localStorage.setItem('melxagency_service_requests', JSON.stringify(serviceRequests));
  }, [serviceRequests]);

  useEffect(() => {
    localStorage.setItem('melxagency_blog_posts', JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    localStorage.setItem('melxagency_faqs', JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem('melxagency_team_members', JSON.stringify(teamMembers));
  }, [teamMembers]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.username === 'informatico' && loginData.password === 'Sam/Dany96') {
      setIsAuthenticated(true);
      setIsLoginOpen(false);
      setShowAdminPanel(true);
      setLoginData({ username: '', password: '' });
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowAdminPanel(false);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: Lead = {
      id: Date.now().toString(),
      ...contactForm,
      status: 'nuevo',
      date: new Date().toISOString()
    };
    setLeads([...leads, newLead]);
    setContactForm({ name: '', email: '', phone: '', company: '', message: '' });
    alert('¡Gracias por tu consulta! Te contactaremos pronto.');
  };

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    
    const newPlanRequest: PlanRequest = {
      id: Date.now().toString(),
      ...planForm,
      plan: selectedPlan,
      status: 'nuevo',
      date: new Date().toISOString()
    };
    setPlanRequests([...planRequests, newPlanRequest]);
    setPlanForm({ name: '', email: '', phone: '', company: '', message: '' });
    setShowPlanModal(false);
    setSelectedPlan(null);
    alert('¡Solicitud de plan enviada! Te contactaremos para coordinar los detalles.');
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newServiceRequest: ServiceRequest = {
      id: Date.now().toString(),
      ...serviceForm,
      status: 'nuevo',
      date: new Date().toISOString()
    };
    setServiceRequests([...serviceRequests, newServiceRequest]);
    setServiceForm({ name: '', email: '', phone: '', company: '', service: '', budget: '', timeline: '', message: '' });
    setShowServiceModal(false);
    alert('¡Solicitud de servicio enviada! Te contactaremos para una consulta personalizada.');
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads(leads.map(lead => lead.id === id ? { ...lead, status } : lead));
  };

  const deleteLead = (id: string) => {
    setLeads(leads.filter(lead => lead.id !== id));
  };

  const updatePlanRequestStatus = (id: string, status: PlanRequest['status']) => {
    setPlanRequests(planRequests.map(request => request.id === id ? { ...request, status } : request));
  };

  const deletePlanRequest = (id: string) => {
    setPlanRequests(planRequests.filter(request => request.id !== id));
  };

  const updateServiceRequestStatus = (id: string, status: ServiceRequest['status']) => {
    setServiceRequests(serviceRequests.map(request => request.id === id ? { ...request, status } : request));
  };

  const deleteServiceRequest = (id: string) => {
    setServiceRequests(serviceRequests.filter(request => request.id !== id));
  };

  const exportToCSV = () => {
    const allData = [
      ...leads.map(lead => ({ ...lead, type: 'Consulta General' })),
      ...planRequests.map(request => ({ ...request, type: 'Solicitud de Plan' })),
      ...serviceRequests.map(request => ({ ...request, type: 'Consulta de Servicio' }))
    ];
    
    const csvContent = [
      ['Tipo', 'Nombre', 'Email', 'Teléfono', 'Empresa', 'Estado', 'Fecha', 'Mensaje'].join(','),
      ...allData.map(item => [
        item.type,
        item.name,
        item.email,
        item.phone,
        item.company,
        item.status,
        new Date(item.date).toLocaleDateString(),
        `"${item.message}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'melxagency_leads.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBlog) {
      setBlogPosts(blogPosts.map(post => 
        post.id === editingBlog.id 
          ? { ...editingBlog, ...blogForm, date: editingBlog.date }
          : post
      ));
      setEditingBlog(null);
    } else {
      const newPost: BlogPost = {
        id: Date.now().toString(),
        ...blogForm,
        date: new Date().toISOString()
      };
      setBlogPosts([...blogPosts, newPost]);
    }
    setBlogForm({ title: '', content: '', category: '', status: 'draft', author: '' });
    setShowBlogModal(false);
  };

  const handleFAQSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFAQ) {
      setFaqs(faqs.map(faq => 
        faq.id === editingFAQ.id 
          ? { ...editingFAQ, ...faqForm }
          : faq
      ));
      setEditingFAQ(null);
    } else {
      const newFAQ: FAQ = {
        id: Date.now().toString(),
        ...faqForm
      };
      setFaqs([...faqs, newFAQ]);
    }
    setFaqForm({ question: '', answer: '', category: '', order: 0 });
    setShowFAQModal(false);
  };

  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create object URL for the uploaded image
    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : '';

    if (editingTeam) {
      setTeamMembers(teamMembers.map(member => 
        member.id === editingTeam.id 
          ? { ...editingTeam, ...teamForm, photo: imageUrl || editingTeam.photo }
          : member
      ));
      setEditingTeam(null);
    } else {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        ...teamForm,
        photo: imageUrl
      };
      setTeamMembers([...teamMembers, newMember]);
    }
    setTeamForm({ firstName: '', lastName: '', specialty: '', bio: '' });
    setImageFile(null);
    setShowTeamModal(false);
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts(blogPosts.filter(post => post.id !== id));
  };

  const deleteFAQ = (id: string) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
  };

  const deleteTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  const filteredLeads = leads.filter(lead => {
    const matchesFilter = leadFilter === 'all' || lead.status === leadFilter;
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredPlanRequests = planRequests.filter(request => {
    const matchesFilter = planFilter === 'all' || request.status === planFilter;
    const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredServiceRequests = serviceRequests.filter(request => {
    const matchesFilter = serviceFilter === 'all' || request.status === serviceFilter;
    const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const publishedPosts = blogPosts.filter(post => post.status === 'published');

  const totalLeads = leads.length + planRequests.length + serviceRequests.length;
  const newLeads = leads.filter(l => l.status === 'nuevo').length + 
                   planRequests.filter(p => p.status === 'nuevo').length +
                   serviceRequests.filter(s => s.status === 'nuevo').length;
  const convertedLeads = leads.filter(l => l.status === 'convertido').length + 
                        planRequests.filter(p => p.status === 'convertido').length +
                        serviceRequests.filter(s => s.status === 'convertido').length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';

  // Testimonios ampliados
  const testimonials = [
    {
      name: "María González",
      company: "TechStart Solutions",
      role: "CEO & Fundadora",
      location: "Miami, FL",
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 5,
      text: "MelxAgency transformó completamente nuestra presencia digital. En 3 meses aumentamos nuestras ventas en un 250% gracias a sus estrategias de Meta Ads. Su equipo es excepcional y los resultados hablan por sí solos.",
      results: "250% aumento en ventas"
    },
    {
      name: "Roberto Silva",
      company: "Innovate Marketing Group",
      role: "Director de Marketing",
      location: "Miami, FL", 
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 5,
      text: "La profesionalidad y dedicación de MelxAgency es incomparable. Nos ayudaron a optimizar nuestro presupuesto publicitario y ahora generamos 3x más leads con la misma inversión. Altamente recomendados.",
      results: "3x más leads generados"
    },
    {
      name: "Carmen Ruiz",
      company: "Bella Vista Boutique",
      role: "Propietaria",
      location: "Miami, FL",
      image: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 5,
      text: "Como pequeña empresa, necesitábamos maximizar cada dólar invertido en publicidad. MelxAgency no solo cumplió, sino que superó nuestras expectativas. Nuestro ROI mejoró un 180%.",
      results: "180% mejora en ROI"
    },
    {
      name: "Diego Fernández",
      company: "Elite Fitness Center",
      role: "Gerente General",
      location: "Miami, FL",
      image: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 5,
      text: "Trabajar con MelxAgency fue la mejor decisión para nuestro gimnasio. Sus campañas segmentadas nos trajeron exactamente el tipo de clientes que buscábamos. Aumentamos membresías en un 300%.",
      results: "300% aumento en membresías"
    },
    {
      name: "Lucía Morales",
      company: "Gourmet Delights Restaurant",
      role: "Chef & Propietaria",
      location: "Miami, FL",
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 5,
      text: "MelxAgency entendió perfectamente nuestra visión gastronómica y la tradujo en campañas digitales exitosas. Nuestras reservas aumentaron un 220% y ahora tenemos lista de espera los fines de semana.",
      results: "220% aumento en reservas"
    },
    {
      name: "Andrés Vega",
      company: "Legal Advisors Miami",
      role: "Socio Principal",
      location: "Miami, FL",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 5,
      text: "En el sector legal, la confianza es fundamental. MelxAgency creó campañas que no solo generaron leads de calidad, sino que posicionaron nuestra firma como líder en Miami. Excelente trabajo.",
      results: "150% más consultas legales"
    }
  ];

  if (showAdminPanel) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header del Panel */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#0e368d] to-[#942ace] flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Control - MelxAgency</h1>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-3xl font-bold text-gray-900">{totalLeads}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-[#0e368d]" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nuevos</p>
                  <p className="text-3xl font-bold text-blue-600">{newLeads}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Convertidos</p>
                  <p className="text-3xl font-bold text-green-600">{convertedLeads}</p>
                </div>
                <Award className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tasa Conversión</p>
                  <p className="text-3xl font-bold text-[#942ace]">{conversionRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-[#942ace]" />
              </div>
            </div>
          </div>

          {/* Pestañas */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'leads', label: 'Consultas Generales', icon: MessageSquare },
                  { id: 'plans', label: 'Solicitudes de Planes', icon: CreditCard },
                  { id: 'services', label: 'Consultas de Servicios', icon: Briefcase },
                  { id: 'blog', label: 'Blog', icon: FileText },
                  { id: 'faq', label: 'FAQ', icon: HelpCircle },
                  { id: 'team', label: 'Equipo', icon: Users }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-[#0e368d] text-[#0e368d]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* Controles */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e368d] focus:border-transparent"
                    />
                  </div>
                  {activeTab === 'leads' && (
                    <select
                      value={leadFilter}
                      onChange={(e) => setLeadFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e368d] focus:border-transparent"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="nuevo">Nuevo</option>
                      <option value="contactado">Contactado</option>
                      <option value="convertido">Convertido</option>
                      <option value="descartado">Descartado</option>
                    </select>
                  )}
                  {activeTab === 'plans' && (
                    <select
                      value={planFilter}
                      onChange={(e) => setPlanFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e368d] focus:border-transparent"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="nuevo">Nuevo</option>
                      <option value="contactado">Contactado</option>
                      <option value="convertido">Convertido</option>
                      <option value="descartado">Descartado</option>
                    </select>
                  )}
                  {activeTab === 'services' && (
                    <select
                      value={serviceFilter}
                      onChange={(e) => setServiceFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e368d] focus:border-transparent"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="nuevo">Nuevo</option>
                      <option value="contactado">Contactado</option>
                      <option value="convertido">Convertido</option>
                      <option value="descartado">Descartado</option>
                    </select>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {(activeTab === 'blog' || activeTab === 'faq' || activeTab === 'team') && (
                    <button
                      onClick={() => {
                        if (activeTab === 'blog') setShowBlogModal(true);
                        if (activeTab === 'faq') setShowFAQModal(true);
                        if (activeTab === 'team') setShowTeamModal(true);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-[#0e368d] text-white rounded-lg hover:bg-[#0c2d75] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>
                        {activeTab === 'blog' && 'Nueva Entrada'}
                        {activeTab === 'faq' && 'Nueva Pregunta'}
                        {activeTab === 'team' && 'Nuevo Miembro'}
                      </span>
                    </button>
                  )}
                  {(activeTab === 'leads' || activeTab === 'plans' || activeTab === 'services') && (
                    <button
                      onClick={exportToCSV}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Exportar CSV</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Contenido de las pestañas */}
              {activeTab === 'leads' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">{lead.message}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{lead.email}</div>
                            <div className="text-sm text-gray-500">{lead.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.company}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                lead.status === 'nuevo' ? 'bg-blue-100 text-blue-800' :
                                lead.status === 'contactado' ? 'bg-yellow-100 text-yellow-800' :
                                lead.status === 'convertido' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              <option value="nuevo">Nuevo</option>
                              <option value="contactado">Contactado</option>
                              <option value="convertido">Convertido</option>
                              <option value="descartado">Descartado</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(lead.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => deleteLead(lead.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'plans' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPlanRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{request.name}</div>
                              <div className="text-sm text-gray-500">{request.company}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{request.email}</div>
                            <div className="text-sm text-gray-500">{request.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              request.plan === 'basico' ? 'bg-blue-100 text-blue-800' :
                              request.plan === 'intermedio' ? 'bg-purple-100 text-purple-800' :
                              'bg-indigo-100 text-indigo-800'
                            }`}>
                              {request.plan.charAt(0).toUpperCase() + request.plan.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={request.status}
                              onChange={(e) => updatePlanRequestStatus(request.id, e.target.value as PlanRequest['status'])}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                request.status === 'nuevo' ? 'bg-blue-100 text-blue-800' :
                                request.status === 'contactado' ? 'bg-yellow-100 text-yellow-800' :
                                request.status === 'convertido' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              <option value="nuevo">Nuevo</option>
                              <option value="contactado">Contactado</option>
                              <option value="convertido">Convertido</option>
                              <option value="descartado">Descartado</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(request.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => deletePlanRequest(request.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'services' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presupuesto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredServiceRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{request.name}</div>
                              <div className="text-sm text-gray-500">{request.company}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{request.email}</div>
                            <div className="text-sm text-gray-500">{request.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{request.service}</div>
                            <div className="text-sm text-gray-500">Timeline: {request.timeline}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.budget}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={request.status}
                              onChange={(e) => updateServiceRequestStatus(request.id, e.target.value as ServiceRequest['status'])}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                request.status === 'nuevo' ? 'bg-blue-100 text-blue-800' :
                                request.status === 'contactado' ? 'bg-yellow-100 text-yellow-800' :
                                request.status === 'convertido' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              <option value="nuevo">Nuevo</option>
                              <option value="contactado">Contactado</option>
                              <option value="convertido">Convertido</option>
                              <option value="descartado">Descartado</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => deleteServiceRequest(request.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'blog' && (
                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">Por {post.author} • {new Date(post.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500 mt-2">{post.content.substring(0, 150)}...</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">{post.category}</span>
                            <span className={`px-2 py-1 text-xs rounded ${
                              post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {post.status === 'published' ? 'Publicado' : 'Borrador'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => {
                              setEditingBlog(post);
                              setBlogForm({
                                title: post.title,
                                content: post.content,
                                category: post.category,
                                status: post.status,
                                author: post.author
                              });
                              setShowBlogModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteBlogPost(post.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'faq' && (
                <div className="space-y-4">
                  {faqs.sort((a, b) => a.order - b.order).map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                          <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">{faq.category}</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Orden: {faq.order}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => {
                              setEditingFAQ(faq);
                              setFaqForm({
                                question: faq.question,
                                answer: faq.answer,
                                category: faq.category,
                                order: faq.order
                              });
                              setShowFAQModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteFAQ(faq.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'team' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="text-center">
                        <img
                          src={member.photo}
                          alt={`${member.firstName} ${member.lastName}`}
                          className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                        />
                        <h3 className="text-lg font-semibold text-gray-900">{member.firstName} {member.lastName}</h3>
                        <p className="text-sm text-[#0e368d] font-medium">{member.specialty}</p>
                        <p className="text-sm text-gray-600 mt-2">{member.bio}</p>
                        <div className="flex justify-center space-x-2 mt-4">
                          <button
                            onClick={() => {
                              setEditingTeam(member);
                              setTeamForm({
                                firstName: member.firstName,
                                lastName: member.lastName,
                                specialty: member.specialty,
                                photo: member.photo,
                                bio: member.bio
                              });
                              setShowTeamModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteTeamMember(member.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modales de administración */}
        {showBlogModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {editingBlog ? 'Editar Entrada' : 'Nueva Entrada de Blog'}
                </h2>
                <form onSubmit={handleBlogSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                      type="text"
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e368d] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                    <textarea
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e368d] focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                      <input
                        type="text"
                        value={blogForm.category}
                        onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e368d] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                      <select
                        value={blogForm.status}
                        onChange={(e) => setBlogForm({...blogForm, status: e.target.value as 'published' | 'draft'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e368d] focus:border-transparent"
                      >
                        <option value="draft">Borrador</option>
                        <option value="published">Publicado</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                      <input
                        type="text"
                        value={blogForm.author}
                        onChange={(e) => setBlogForm({...blogForm, author: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e368d] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowBlogModal(false);
                        setEditingBlog(null);
                        setBlogForm({ title: '', content: '', category: '', status: 'draft', author: '' });
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0e368d] text-white rounded-lg hover:bg-[#0c2d75] transition-colors"
                    >
                      {editingBlog ? 'Actualizar' : 'Crear'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showFAQModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {editingFAQ ? 'Editar Pregunta' : 'Nueva Pregunta Frecuente'}
                </h2>
                <form onSubmit={handleFAQSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pregunta</label>
                    <input
                      type="text"
                      value={faqForm.question}
                      onChange={(e) => setFaqForm({...faqForm, question: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e368d] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Respuesta</label>
                    <textarea
                      value={faqForm.answer}
                      onChange={(e) => setFaqForm({...faqForm, answer: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e368d] focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                      <input
                        type="text"
                        value={faqForm.category}
                        onChange={(e) => setFaqForm({...faqForm, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e368d] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                      <input
                        type="number"
                        value={faqForm.order}
                        onChange={(e) => setFaqForm({...faqForm, order: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e368d] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowFAQModal(false);
                        setEditingFAQ(null);
                        setFaqForm({ question: '', answer: '', category: '', order: 0 });
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0e368d] text-white rounded-lg hover:bg-[#0c2d75] transition-colors"
                    >
                      {editingFAQ ? 'Actualizar' : 'Crear'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showTeamModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {editingTeam ? 'Editar Miembro' : 'Nuevo Miembro del Equipo'}
                </h2>
                <form onSubmit={handleTeamSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                      <input
                        type="text"
                        value={teamForm.firstName}
                        onChange={(e) => setTeamForm({...teamForm, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e368d] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                      <input
                        type="text"
                        value={teamForm.lastName}
                        onChange={(e) => setTeamForm({...teamForm, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e368d] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
                    <input
                      type="text"
                      value={teamForm.specialty}
                      onChange={(e) => setTeamForm({...teamForm, specialty: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e368d] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Foto del Miembro
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImageFile(file);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e368d] focus:border-transparent"
                    />
                    {imageFile && (
                      <p className="text-sm text-gray-500 mt-1">
                        Archivo seleccionado: {imageFile.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Biografía</label>
                    <textarea
                      value={teamForm.bio}
                      onChange={(e) => setTeamForm({...teamForm, bio: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e368d] focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowTeamModal(false);
                        setEditingTeam(null);
                        setTeamForm({ firstName: '', lastName: '', specialty: '', photo: '', bio: '' });
                        setImageFile(null);
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={!teamForm.firstName || !teamForm.specialty || (!imageFile && !editingTeam)}
                      className="px-4 py-2 bg-[#0e368d] text-white rounded-lg hover:bg-[#0c2d75] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {editingTeam ? 'Actualizar' : 'Crear'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm fixed w-full z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#0e368d] to-[#942ace] flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#0e368d] to-[#942ace] bg-clip-text text-transparent">
                MelxAgency
              </span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#inicio" className="text-gray-700 hover:text-[#0e368d] font-medium transition-colors">Inicio</a>
              <a href="#proceso" className="text-gray-700 hover:text-[#0e368d] font-medium transition-colors">Proceso</a>
              <a href="#servicios" className="text-gray-700 hover:text-[#0e368d] font-medium transition-colors">Servicios</a>
              <a href="#planes" className="text-gray-700 hover:text-[#0e368d] font-medium transition-colors">Planes</a>
              <a href="#equipo" className="text-gray-700 hover:text-[#0e368d] font-medium transition-colors">Equipo</a>
              <a href="#blog" className="text-gray-700 hover:text-[#0e368d] font-medium transition-colors">Blog</a>
              <a href="#testimonios" className="text-gray-700 hover:text-[#0e368d] font-medium transition-colors">Testimonios</a>
              <a href="#contacto" className="text-gray-700 hover:text-[#0e368d] font-medium transition-colors">Contacto</a>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="bg-gradient-to-r from-[#0e368d] to-[#942ace] text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
              >
                Acceso
              </button>
            </nav>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-2">
              <a href="#inicio" className="block py-2 text-gray-700 hover:text-[#0e368d]">Inicio</a>
              <a href="#proceso" className="block py-2 text-gray-700 hover:text-[#0e368d]">Proceso</a>
              <a href="#servicios" className="block py-2 text-gray-700 hover:text-[#0e368d]">Servicios</a>
              <a href="#planes" className="block py-2 text-gray-700 hover:text-[#0e368d]">Planes</a>
              <a href="#equipo" className="block py-2 text-gray-700 hover:text-[#0e368d]">Equipo</a>
              <a href="#blog" className="block py-2 text-gray-700 hover:text-[#0e368d]">Blog</a>
              <a href="#testimonios" className="block py-2 text-gray-700 hover:text-[#0e368d]">Testimonios</a>
              <a href="#contacto" className="block py-2 text-gray-700 hover:text-[#0e368d]">Contacto</a>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="w-full text-left py-2 text-[#0e368d] font-medium"
              >
                Acceso
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section con Carrusel */}
      <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0e368d]/80 to-[#942ace]/80"></div>
            </div>
          ))}
        </div>

        {/* Controles del carrusel */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Contenido del Hero */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {slides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
            {slides[currentSlide].subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#planes"
              className="bg-white text-[#0e368d] px-8 py-4 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Ver Planes
            </a>
            <a
              href="#contacto"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#0e368d] transition-all duration-200"
            >
              Consulta Gratuita
            </a>
          </div>
        </div>
      </section>

      {/* Sección Cómo Funciona */}
      <section id="proceso" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Cómo <span className="bg-gradient-to-r from-[#0e368d] to-[#942ace] bg-clip-text text-transparent">Funciona</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestro proceso probado en 4 pasos para transformar tu presencia digital y maximizar tus resultados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Análisis Inicial",
                description: "Evaluamos tu negocio, competencia y objetivos para crear una estrategia personalizada",
                icon: Target,
                color: "from-blue-500 to-blue-600"
              },
              {
                step: "02", 
                title: "Estrategia Digital",
                description: "Desarrollamos un plan integral de marketing digital adaptado a tu industria y presupuesto",
                icon: TrendingUp,
                color: "from-purple-500 to-purple-600"
              },
              {
                step: "03",
                title: "Implementación",
                description: "Ejecutamos las campañas con creativos profesionales y segmentación avanzada",
                icon: Users,
                color: "from-indigo-500 to-indigo-600"
              },
              {
                step: "04",
                title: "Optimización",
                description: "Monitoreamos y optimizamos constantemente para maximizar tu retorno de inversión",
                icon: Award,
                color: "from-violet-500 to-violet-600"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="relative group">
                  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-6xl font-bold text-gray-100 absolute top-4 right-6 group-hover:text-gray-200 transition-colors">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#0e368d] to-[#942ace] transform -translate-y-1/2"></div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <a
              href="#planes"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#0e368d] to-[#942ace] text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <span>Comenzar Ahora</span>
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section id="servicios" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ofrecemos soluciones integrales de marketing digital para hacer crecer tu negocio
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Marketing Digital</h3>
              <p className="text-gray-600 leading-relaxed">
                Estrategias completas para aumentar tu presencia online y generar más ventas.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Gestión de Redes Sociales</h3>
              <p className="text-gray-600 leading-relaxed">
                Administración profesional de tus redes sociales con contenido de calidad.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Publicidad en Meta</h3>
              <p className="text-gray-600 leading-relaxed">
                Campañas optimizadas en Facebook e Instagram para maximizar tu ROI.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Branding y Diseño</h3>
              <p className="text-gray-600 leading-relaxed">
                Creación de identidad visual que conecte con tu audiencia objetivo.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300 shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Análisis y Reportes</h3>
              <p className="text-gray-600 leading-relaxed">
                Métricas detalladas y análisis para optimizar tus campañas continuamente.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300 shadow-lg">
                <Laptop className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Desarrollo Web</h3>
              <p className="text-gray-600 leading-relaxed">
                Sitios web modernos y aplicaciones que combinan diseño atractivo con funcionalidad excepcional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Planes */}
      <section id="planes" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Planes <span className="bg-gradient-to-r from-[#0e368d] to-[#942ace] bg-clip-text text-transparent">Publicitarios</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Escoge el plan que más se ajuste a tus objetivos de marketing digital
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan Básico */}
            <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-[#0e368d] transition-all duration-300 hover:shadow-xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Básico</h3>
                <p className="text-gray-600 mb-6">Ideal aumentar visibilidad y comenzar a convertir.</p>
                <div className="text-4xl font-bold text-[#0e368d] mb-2">$299</div>
                <div className="text-gray-500">/Mes</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#0e368d]" />
                  <span className="text-gray-700">Diseño de 4 imágenes</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#0e368d]" />
                  <span className="text-gray-700">Creación y Gestión de redes</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#0e368d]" />
                  <span className="text-gray-700">Meta ads (210 USD x Mes)</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#0e368d]" />
                  <span className="text-gray-700">Anuncios en grupos públicos</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#0e368d]" />
                  <span className="text-gray-700">Diseño de Logotipo</span>
                </li>
              </ul>
              
              <button
                onClick={() => {
                  setSelectedPlan('basico');
                  setShowPlanModal(true);
                }}
                className="w-full bg-[#0e368d] text-white py-3 rounded-xl font-semibold hover:bg-[#0c2d75] transition-colors"
              >
                Solicitar Plan
              </button>
            </div>

            {/* Plan Intermedio */}
            <div className="relative bg-white border-2 border-[#942ace] rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-[#942ace] text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>Más Popular</span>
                </div>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Intermedio</h3>
                <p className="text-gray-600 mb-6">Ideal escalar y posicionarte con mayor impacto.</p>
                <div className="text-4xl font-bold text-[#942ace] mb-2">$399</div>
                <div className="text-gray-500">/Mes</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#942ace]" />
                  <span className="text-gray-700">Diseño de 6 imágenes</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#942ace]" />
                  <span className="text-gray-700">Creación y Gestión de redes</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#942ace]" />
                  <span className="text-gray-700">Meta ads (270 USD x Mes)</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#942ace]" />
                  <span className="text-gray-700">Anuncios en grupos públicos</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#942ace]" />
                  <span className="text-gray-700">Estadísticas y soporte</span>
                </li>
              </ul>
              
              <button
                onClick={() => {
                  setSelectedPlan('intermedio');
                  setShowPlanModal(true);
                }}
                className="w-full bg-[#942ace] text-white py-3 rounded-xl font-semibold hover:bg-[#7a2299] transition-colors"
              >
                Solicitar Plan
              </button>
            </div>

            {/* Plan Avanzado */}
            <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-[#0e368d] transition-all duration-300 hover:shadow-xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Avanzado</h3>
                <p className="text-gray-600 mb-6">La solución más completa para dominar tu marketing.</p>
                <div className="text-4xl font-bold text-[#0e368d] mb-2">$649</div>
                <div className="text-gray-500">/Mes</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#0e368d]" />
                  <span className="text-gray-700">Diseño de 8 imágenes</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#0e368d]" />
                  <span className="text-gray-700">Administración de redes</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#0e368d]" />
                  <span className="text-gray-700">Meta ads (360 USD x Mes)</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#0e368d]" />
                  <span className="text-gray-700">Confección de Landingpage</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#0e368d]" />
                  <span className="text-gray-700">Estadísticas y reportes</span>
                </li>
              </ul>
              
              <button
                onClick={() => {
                  setSelectedPlan('avanzado');
                  setShowPlanModal(true);
                }}
                className="w-full bg-[#0e368d] text-white py-3 rounded-xl font-semibold hover:bg-[#0c2d75] transition-colors"
              >
                Solicitar Plan
              </button>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">¿Necesitas algo personalizado?</p>
            <a
              href="#consulta"
              className="inline-flex items-center space-x-2 text-[#0e368d] font-semibold hover:text-[#942ace] transition-colors"
            >
              <span>Solicita una consulta personalizada</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Sección del Equipo */}
      <section id="equipo" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nuestro <span className="bg-gradient-to-r from-[#0e368d] to-[#942ace] bg-clip-text text-transparent">Equipo</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profesionales especializados en marketing digital con años de experiencia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                <div className="relative">
                  <img
                    src={member.photo}
                    alt={`${member.firstName} ${member.lastName}`}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.firstName} {member.lastName}</h3>
                  <p className="text-[#0e368d] font-semibold mb-3">{member.specialty}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Blog */}
      <section id="blog" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Blog y <span className="bg-gradient-to-r from-[#0e368d] to-[#942ace] bg-clip-text text-transparent">Noticias</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Mantente al día con las últimas tendencias y estrategias de marketing digital
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedPosts.slice(0, 6).map((post) => (
              <article key={post.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#0e368d] text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <User className="w-4 h-4 mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0e368d] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {post.content.substring(0, 120)}...
                  </p>
                  <button className="text-[#0e368d] font-semibold hover:text-[#942ace] transition-colors flex items-center space-x-1">
                    <span>Leer más</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {publishedPosts.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No hay entradas publicadas aún</p>
            </div>
          )}

          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-[#0e368d] to-[#942ace] text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              Ver Todas las Entradas
            </button>
          </div>
        </div>
      </section>

      {/* Sección de Testimonios */}
      <section id="testimonios" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Lo que dicen nuestros <span className="bg-gradient-to-r from-[#0e368d] to-[#942ace] bg-clip-text text-transparent">Clientes</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empresas de Miami que han transformado su presencia digital con nosotros
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 group">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-[#0e368d] font-medium">{testimonial.role}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                    <p className="text-xs text-gray-400">{testimonial.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <Quote className="w-8 h-8 text-[#942ace] mb-4 opacity-50" />
                <p className="text-gray-700 leading-relaxed mb-4">{testimonial.text}</p>
                
                <div className="bg-gradient-to-r from-[#0e368d]/10 to-[#942ace]/10 rounded-lg p-3">
                  <p className="text-sm font-semibold text-[#0e368d]">Resultado: {testimonial.results}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="#contacto"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#0e368d] to-[#942ace] text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <span>Únete a Nuestros Clientes Exitosos</span>
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Sección FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Preguntas <span className="bg-gradient-to-r from-[#0e368d] to-[#942ace] bg-clip-text text-transparent">Frecuentes</span>
            </h2>
            <p className="text-xl text-gray-600">
              Resolvemos las dudas más comunes sobre nuestros servicios
            </p>
          </div>

          <div className="space-y-4">
            {faqs.sort((a, b) => a.order - b.order).map((faq) => (
              <div key={faq.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {expandedFAQ === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-[#0e368d]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#0e368d]" />
                  )}
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">¿No encuentras la respuesta que buscas?</p>
            <a
              href="#contacto"
              className="inline-flex items-center space-x-2 text-[#0e368d] font-semibold hover:text-[#942ace] transition-colors"
            >
              <span>Contáctanos directamente</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Sección de Consulta de Servicios */}
      <section id="consulta" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Solicita un <span className="bg-gradient-to-r from-[#0e368d] to-[#942ace] bg-clip-text text-transparent">Servicio Específico</span>
            </h2>
            <p className="text-xl text-gray-600">
              ¿Necesitas algo personalizado? Cuéntanos exactamente qué necesitas y te haremos una propuesta a medida
            </p>
          </div>

          <div className="bg-gradient-to-r from-[#0e368d]/5 to-[#942ace]/5 rounded-2xl p-8 border border-gray-200">
            <form onSubmit={handleServiceSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo *</label>
                  <input
                    type="text"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0e368d] focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={serviceForm.email}
                    onChange={(e) => setServiceForm({...serviceForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0e368d] focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono *</label>
                  <input
                    type="tel"
                    value={serviceForm.phone}
                    onChange={(e) => setServiceForm({...serviceForm, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0e368d] focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Empresa</label>
                  <input
                    type="text"
                    value={serviceForm.company}
                    onChange={(e) => setServiceForm({...serviceForm, company: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0e368d] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Servicio Específico *</label>
                <select
                  value={serviceForm.service}
                  onChange={(e) => setServiceForm({...serviceForm, service: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0e368d] focus:border-transparent transition-all"
                  required
                >
                  <option value="">Selecciona un servicio</option>
                  <option value="Meta Ads Personalizado">Meta Ads Personalizado</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Diseño de Landing Page">Diseño de Landing Page</option>
                  <option value="Gestión de Redes Sociales">Gestión de Redes Sociales</option>
                  <option value="SEO y Posicionamiento">SEO y Posicionamiento</option>
                  <option value="Email Marketing">Email Marketing</option>
                  <option value="Branding Completo">Branding Completo</option>
                  <option value="Consultoría Estratégica">Consultoría Estratégica</option>
                  <option value="Otro">Otro (especificar en mensaje)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Presupuesto Estimado *</label>
                  <select
                    value={serviceForm.budget}
                    onChange={(e) => setServiceForm({...serviceForm, budget: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0e368d] focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Selecciona un rango</option>
                    <option value="$500 - $1,000">$500 - $1,000</option>
                    <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                    <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                    <option value="$10,000+">$10,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Timeline *</label>
                  <select
                    value={serviceForm.timeline}
                    onChange={(e) => setServiceForm({...serviceForm, timeline: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0e368d] focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Selecciona un plazo</option>
                    <option value="Inmediato (1-2 semanas)">Inmediato (1-2 semanas)</option>
                    <option value="Corto plazo (1 mes)">Corto plazo (1 mes)</option>
                    <option value="Mediano plazo (2-3 meses)">Mediano plazo (2-3 meses)</option>
                    <option value="Largo plazo (3+ meses)">Largo plazo (3+ meses)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Detalles del Proyecto *</label>
                <textarea
                  value={serviceForm.message}
                  onChange={(e) => setServiceForm({...serviceForm, message: e.target.value})}
                  rows={4}
                  placeholder="Describe detalladamente qué necesitas, objetivos específicos, audiencia objetivo, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0e368d] focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#0e368d] to-[#942ace] text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Solicitar Consulta Personalizada
                </button>
              </div>
            </form>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              📞 ¿Prefieres hablar directamente? Llámanos al 
              <a href="tel:+17868215120" className="text-[#0e368d] font-semibold hover:text-[#942ace] transition-colors ml-1">
                +1 (786) 821-5120
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Sección de Contacto */}
      <section id="contacto" className="py-20 bg-gradient-to-r from-[#0e368d] to-[#942ace]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ¿Listo para Crecer?
            </h2>
            <p className="text-xl text-white/90">
              Contáctanos hoy y comienza a ver resultados reales en tu negocio
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo *</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0e368d] focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0e368d] focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono *</label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0e368d] focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Empresa</label>
                  <input
                    type="text"
                    value={contactForm.company}
                    onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0e368d] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mensaje *</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  rows={4}
                  placeholder="Cuéntanos sobre tu proyecto y objetivos..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0e368d] focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#0e368d] to-[#942ace] text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Enviar Consulta
                </button>
              </div>
            </form>
          </div>

          <div className="text-center mt-8">
            <p className="text-white/90">
              🚀 Respuesta garantizada en menos de 24 horas
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Columna 1: Información de la empresa */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#0e368d] to-[#942ace] flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">MelxAgency</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Agencia líder en marketing digital en Miami, especializada en Meta Ads y estrategias de crecimiento para empresas ambiciosas.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-[#0e368d] rounded-full flex items-center justify-center hover:bg-[#942ace] transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-[#0e368d] rounded-full flex items-center justify-center hover:bg-[#942ace] transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-[#0e368d] rounded-full flex items-center justify-center hover:bg-[#942ace] transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-[#0e368d] rounded-full flex items-center justify-center hover:bg-[#942ace] transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Columna 2: Servicios */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Nuestros Servicios</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Meta Ads (Facebook & Instagram)</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Google Ads</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Gestión de Redes Sociales</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Diseño de Landing Pages</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">SEO y Posicionamiento</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Email Marketing</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Branding y Diseño</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Consultoría Digital</a></li>
              </ul>
            </div>

            {/* Columna 3: Contacto */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Contacto</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#942ace] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">1234 Biscayne Blvd</p>
                    <p className="text-gray-300">Miami, FL 33132</p>
                    <p className="text-gray-300">Estados Unidos</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#942ace]" />
                  <a href="tel:+17868215120" className="text-gray-300 hover:text-white transition-colors">
                    +1 (786) 821-5120
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#942ace]" />
                  <a href="mailto:info@melxagency.com" className="text-gray-300 hover:text-white transition-colors">
                    info@melxagency.com
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[#942ace] mt-1" />
                  <div>
                    <p className="text-gray-300">Lun - Vie: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-300">Sáb: 10:00 AM - 2:00 PM</p>
                    <p className="text-gray-300">Dom: Cerrado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna 4: Legal y Certificaciones */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Información Legal</h3>
              <ul className="space-y-3 mb-6">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Política de Privacidad</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Términos de Servicio</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Política de Cookies</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Aviso Legal</a></li>
              </ul>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-[#942ace]" />
                  <span className="text-sm text-gray-300">Meta Business Partner</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-[#942ace]" />
                  <span className="text-sm text-gray-300">Google Ads Certified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-[#942ace]" />
                  <span className="text-sm text-gray-300">100% Garantía de Satisfacción</span>
                </div>
              </div>
            </div>
          </div>

          {/* Línea divisoria */}
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 MelxAgency. Todos los derechos reservados.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <span className="text-gray-400 text-sm">Síguenos:</span>
                <div className="flex space-x-3">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de Login */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#0e368d] to-[#942ace] flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Acceso Administrativo</h2>
              <p className="text-gray-600 mt-2">Ingresa tus credenciales para acceder al panel</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Usuario</label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0e368d] focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0e368d] focus:border-transparent transition-all"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsLoginOpen(false)}
                  className="flex-1 py-3 text-gray-700 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#0e368d] to-[#942ace] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Ingresar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Solicitud de Plan */}
      {showPlanModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Solicitar Plan {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
              </h2>
              <p className="text-gray-600 mt-2">
                Completa el formulario y nos pondremos en contacto contigo
              </p>
            </div>
            
            <form onSubmit={handlePlanSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo *</label>
                  <input
                    type="text"
                    value={planForm.name}
                    onChange={(e) => setPlanForm({...planForm, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0e368d] focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={planForm.email}
                    onChange={(e) => setPlanForm({...planForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0e368d] focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono *</label>
                  <input
                    type="tel"
                    value={planForm.phone}
                    onChange={(e) => setPlanForm({...planForm, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0e368d] focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Empresa</label>
                  <input
                    type="text"
                    value={planForm.company}
                    onChange={(e) => setPlanForm({...planForm, company: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0e368d] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mensaje Adicional</label>
                <textarea
                  value={planForm.message}
                  onChange={(e) => setPlanForm({...planForm, message: e.target.value})}
                  rows={3}
                  placeholder="Cuéntanos más sobre tu negocio y objetivos..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0e368d] focus:border-transparent transition-all"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPlanModal(false);
                    setSelectedPlan(null);
                    setPlanForm({ name: '', email: '', phone: '', company: '', message: '' });
                  }}
                  className="flex-1 py-3 text-gray-700 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#0e368d] to-[#942ace] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Solicitar Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;