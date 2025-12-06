/* ============================================
   ENTERPRISE SECURITY ARCHITECTURE REFERENCE
   Main JavaScript - Interactive Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initSearch();
  initCollapsibles();
  initComparisonTabs();
  initCopyButtons();
  initMobileMenu();
  initScrollSpy();
});

/* ---------- Navigation ---------- */
function initNavigation() {
  // Handle sidebar navigation expansion
  const navItems = document.querySelectorAll('.sidebar-nav-item');
  
  navItems.forEach(item => {
    const link = item.querySelector('.sidebar-nav-link');
    const submenu = item.querySelector('.sidebar-submenu');
    
    if (submenu && link) {
      link.addEventListener('click', function(e) {
        // If there's a submenu, toggle expansion
        if (submenu.children.length > 0) {
          e.preventDefault();
          item.classList.toggle('expanded');
        }
      });
    }
  });

  // Highlight current page in navigation
  highlightCurrentPage();
  
  // Save sidebar scroll position before navigating
  saveSidebarScrollOnNavigate();
}

function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  const currentFile = currentPath.split('/').pop() || 'index.html';
  
  const navLinks = document.querySelectorAll('.sidebar-nav-link, .sidebar-submenu-link');
  const sidebar = document.querySelector('.sidebar');
  
  // Remove any existing active class
  navLinks.forEach(link => link.classList.remove('active'));
  
  let activeLink = null;
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.classList.add('active');
      activeLink = link;
      
      // Expand parent if in submenu
      const parentItem = link.closest('.sidebar-nav-item');
      if (parentItem) {
        parentItem.classList.add('expanded');
      }
    }
  });
  
  // Scroll sidebar to show active link
  if (sidebar && activeLink) {
    // Check if there's a saved scroll position for this page
    const savedScroll = sessionStorage.getItem('sidebarScroll');
    
    setTimeout(() => {
      if (savedScroll !== null) {
        // Restore saved scroll position
        sidebar.scrollTop = parseInt(savedScroll, 10);
        sessionStorage.removeItem('sidebarScroll');
      } else {
        // Scroll to active link
        scrollSidebarToActive(sidebar, activeLink);
      }
    }, 50);
  }
}

function scrollSidebarToActive(sidebar, activeLink) {
  const linkRect = activeLink.getBoundingClientRect();
  const sidebarRect = sidebar.getBoundingClientRect();
  
  // Check if active link is not visible in viewport
  const isAboveViewport = linkRect.top < sidebarRect.top;
  const isBelowViewport = linkRect.bottom > sidebarRect.bottom;
  
  if (isAboveViewport || isBelowViewport) {
    // Calculate scroll position to put active link in upper third of sidebar
    const linkOffsetTop = activeLink.offsetTop;
    const scrollTarget = linkOffsetTop - (sidebar.clientHeight / 4);
    
    sidebar.scrollTo({
      top: Math.max(0, scrollTarget),
      behavior: 'smooth'
    });
  }
}

function saveSidebarScrollOnNavigate() {
  const sidebar = document.querySelector('.sidebar');
  const navLinks = document.querySelectorAll('.sidebar-nav-link');
  
  if (sidebar) {
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        // Save current scroll position before navigation
        sessionStorage.setItem('sidebarScroll', sidebar.scrollTop.toString());
      });
    });
  }
}

/* ---------- Search Functionality ---------- */
const searchIndex = [
  // Foundational Concepts
  { title: 'Security Architecture Principles', section: 'Foundational Concepts', url: 'principles.html', keywords: 'defense depth zero trust least privilege separation duties' },
  { title: 'Security Frameworks', section: 'Foundational Concepts', url: 'frameworks.html', keywords: 'nist iso cis mitre sabsa framework compliance' },
  { title: 'Deployment Models', section: 'Foundational Concepts', url: 'deployment-models.html', keywords: 'cloud hybrid multi-cloud on-premises datacenter' },
  { title: 'Compliance & Regulatory', section: 'Foundational Concepts', url: 'compliance.html', keywords: 'pci hipaa sox gdpr fedramp compliance regulatory' },
  { title: 'Threat Landscape', section: 'Foundational Concepts', url: 'threat-landscape.html', keywords: 'threat attack vectors kill chain nation-state insider' },
  
  // Network Security
  { title: 'Firewalls & NGFW', section: 'Network Security', url: 'firewalls.html', keywords: 'firewall ngfw next-gen palo alto fortinet cisco packet filter' },
  { title: 'DMZ Architecture', section: 'Network Security', url: 'dmz.html', keywords: 'dmz demilitarized zone dual firewall perimeter' },
  { title: 'Network Segmentation', section: 'Network Security', url: 'segmentation.html', keywords: 'vlan segmentation zones lateral movement' },
  { title: 'Micro-segmentation', section: 'Network Security', url: 'micro-segmentation.html', keywords: 'micro-segmentation nsx software-defined zero trust' },
  { title: 'Zero Trust Network Access', section: 'Network Security', url: 'ztna.html', keywords: 'ztna zero trust vpn replacement zscaler' },
  { title: 'DNS Security', section: 'Network Security', url: 'dns-security.html', keywords: 'dns dnssec doh tunneling sinkhole filtering' },
  { title: 'Network Detection & Response', section: 'Network Security', url: 'ndr.html', keywords: 'ndr network detection response east-west traffic' },
  { title: 'DDoS Protection', section: 'Network Security', url: 'ddos.html', keywords: 'ddos cloudflare akamai shield scrubbing' },
  { title: 'IDS/IPS', section: 'Network Security', url: 'ids-ips.html', keywords: 'ids ips intrusion detection prevention signature' },
  { title: 'Web Application Firewall', section: 'Network Security', url: 'waf.html', keywords: 'waf owasp sql injection xss bot' },
  
  // Remote Access
  { title: 'Traditional VPN', section: 'Connectivity', url: 'vpn.html', keywords: 'vpn ipsec site-to-site remote access tunnel' },
  { title: 'Always-On VPN', section: 'Connectivity', url: 'always-on-vpn.html', keywords: 'always-on vpn device tunnel user tunnel' },
  { title: 'ExpressRoute & Direct Connect', section: 'Connectivity', url: 'dedicated-connectivity.html', keywords: 'expressroute direct connect private fiber peering' },
  { title: 'SD-WAN', section: 'Connectivity', url: 'sd-wan.html', keywords: 'sd-wan mpls wan optimization application routing' },
  { title: 'SASE Architecture', section: 'Connectivity', url: 'sase.html', keywords: 'sase secure access service edge zscaler zia zpa' },
  { title: 'Remote Desktop Services', section: 'Connectivity', url: 'remote-desktop.html', keywords: 'rdp rds gateway virtual desktop avd citrix' },
  { title: 'Hybrid Connectivity', section: 'Connectivity', url: 'hybrid-connectivity.html', keywords: 'hub-spoke mesh transit gateway hybrid' },
  { title: 'Bastion & Jump Servers', section: 'Connectivity', url: 'bastion.html', keywords: 'bastion jump server jit just-in-time session recording' },
  
  // Identity & Access Management
  { title: 'Directory Services', section: 'Identity', url: 'directory-services.html', keywords: 'active directory azure ad entra hybrid identity' },
  { title: 'Authentication Protocols', section: 'Identity', url: 'auth-protocols.html', keywords: 'kerberos ntlm saml oauth oidc jwt' },
  { title: 'Single Sign-On', section: 'Identity', url: 'sso.html', keywords: 'sso federation password hash sync pass-through adfs' },
  { title: 'Multi-Factor Authentication', section: 'Identity', url: 'mfa.html', keywords: 'mfa 2fa totp fido2 authenticator biometric' },
  { title: 'Conditional Access', section: 'Identity', url: 'conditional-access.html', keywords: 'conditional access policies risk location device' },
  { title: 'Privileged Access Management', section: 'Identity', url: 'pam.html', keywords: 'pam privileged access cyberark vault jit session' },
  { title: 'Service Principal & Managed Identity', section: 'Identity', url: 'service-principals.html', keywords: 'service principal managed identity workload azure' },
  { title: 'Identity Governance', section: 'Identity', url: 'identity-governance.html', keywords: 'governance access review lifecycle entitlement' },
  { title: 'B2B Identity', section: 'Identity', url: 'b2b-identity.html', keywords: 'b2b guest external collaboration partner' },
  { title: 'B2C Identity', section: 'Identity', url: 'b2c-identity.html', keywords: 'b2c customer identity ciam social login' },
  { title: 'Workload Identity Federation', section: 'Identity', url: 'workload-federation.html', keywords: 'workload federation github actions oidc' },
  { title: 'Identity Threat Detection', section: 'Identity', url: 'identity-protection.html', keywords: 'identity protection impossible travel leaked credential risk' },
  
  // Endpoint Security
  { title: 'Antivirus Evolution', section: 'Endpoint Security', url: 'antivirus.html', keywords: 'antivirus av ngav behavioral machine learning' },
  { title: 'EDR', section: 'Endpoint Security', url: 'edr.html', keywords: 'edr endpoint detection response crowdstrike defender' },
  { title: 'XDR', section: 'Endpoint Security', url: 'xdr.html', keywords: 'xdr extended detection response correlation' },
  { title: 'MDM/UEM', section: 'Endpoint Security', url: 'mdm.html', keywords: 'mdm uem intune mobile device management autopilot' },
  { title: 'Application Control', section: 'Endpoint Security', url: 'app-control.html', keywords: 'application control whitelist wdac applocker' },
  { title: 'Device Compliance', section: 'Endpoint Security', url: 'device-compliance.html', keywords: 'compliance health attestation bitlocker' },
  { title: 'Browser Isolation', section: 'Endpoint Security', url: 'browser-isolation.html', keywords: 'browser isolation remote container pixel' },
  { title: 'Endpoint DLP', section: 'Endpoint Security', url: 'endpoint-dlp.html', keywords: 'dlp data loss prevention usb print clipboard' },
  
  // Cloud Security
  { title: 'Cloud-Only Architecture', section: 'Cloud Security', url: 'cloud-only.html', keywords: 'cloud-native saas born-in-cloud' },
  { title: 'Hybrid Cloud Architecture', section: 'Cloud Security', url: 'hybrid-cloud.html', keywords: 'hybrid cloud datacenter migration' },
  { title: 'Multi-Cloud Architecture', section: 'Cloud Security', url: 'multi-cloud.html', keywords: 'multi-cloud aws azure gcp cross-cloud' },
  { title: 'Azure Landing Zone', section: 'Cloud Security', url: 'azure-landing-zone.html', keywords: 'azure landing zone hub spoke subscription management' },
  { title: 'AWS Landing Zone', section: 'Cloud Security', url: 'aws-landing-zone.html', keywords: 'aws landing zone organizations vpc transit' },
  { title: 'CSPM', section: 'Cloud Security', url: 'cspm.html', keywords: 'cspm cloud security posture management defender prisma' },
  { title: 'CWPP', section: 'Cloud Security', url: 'cwpp.html', keywords: 'cwpp cloud workload protection vm container serverless' },
  { title: 'CASB', section: 'Cloud Security', url: 'casb.html', keywords: 'casb cloud access security broker shadow it saas' },
  { title: 'Container Security', section: 'Cloud Security', url: 'container-security.html', keywords: 'container docker image scanning runtime admission' },
  { title: 'Kubernetes Security', section: 'Cloud Security', url: 'kubernetes-security.html', keywords: 'kubernetes k8s rbac network policy pod security' },
  { title: 'Serverless Security', section: 'Cloud Security', url: 'serverless-security.html', keywords: 'serverless lambda function iam secrets' },
  { title: 'Cloud Native Security Services', section: 'Cloud Security', url: 'cloud-native-security.html', keywords: 'defender security hub cloud armor waf shield' },
  
  // Data Security
  { title: 'Data Classification', section: 'Data Security', url: 'data-classification.html', keywords: 'classification sensitivity labels auto-classify purview' },
  { title: 'Data Loss Prevention', section: 'Data Security', url: 'dlp.html', keywords: 'dlp data loss prevention policy endpoint network cloud' },
  { title: 'Encryption Architecture', section: 'Data Security', url: 'encryption.html', keywords: 'encryption at-rest in-transit tde bitlocker tls' },
  { title: 'Key Management', section: 'Data Security', url: 'key-management.html', keywords: 'key management hsm vault kms rotation' },
  { title: 'Information Rights Management', section: 'Data Security', url: 'irm.html', keywords: 'irm aip rights management protection watermark' },
  { title: 'Database Security', section: 'Data Security', url: 'database-security.html', keywords: 'database tde always encrypted masking row-level' },
  { title: 'Backup Security', section: 'Data Security', url: 'backup-security.html', keywords: 'backup immutable ransomware air-gapped recovery' },
  { title: 'Secure Data Transfer', section: 'Data Security', url: 'data-transfer.html', keywords: 'sftp mft api b2b data transfer' },
  
  // Email & Collaboration
  { title: 'Email Security Gateway', section: 'Email Security', url: 'email-gateway.html', keywords: 'email gateway eop proofpoint mimecast sandbox' },
  { title: 'Email Authentication', section: 'Email Security', url: 'email-auth.html', keywords: 'spf dkim dmarc email authentication spoofing' },
  { title: 'Anti-Phishing', section: 'Email Security', url: 'anti-phishing.html', keywords: 'phishing impersonation brand protection ai detection' },
  { title: 'Email Encryption', section: 'Email Security', url: 'email-encryption.html', keywords: 'email encryption ome s/mime pgp portal' },
  { title: 'Collaboration Security', section: 'Email Security', url: 'collaboration-security.html', keywords: 'teams slack collaboration external sharing dlp' },
  { title: 'Email Archiving & eDiscovery', section: 'Email Security', url: 'email-archiving.html', keywords: 'archiving ediscovery legal hold retention' },
  
  // SIEM & SecOps
  { title: 'SIEM Architecture', section: 'Security Operations', url: 'siem.html', keywords: 'siem splunk sentinel chronicle log correlation' },
  { title: 'Log Collection', section: 'Security Operations', url: 'log-collection.html', keywords: 'log collection syslog agent forwarding' },
  { title: 'Detection Engineering', section: 'Security Operations', url: 'detection-engineering.html', keywords: 'detection rules sigma mitre att&ck custom' },
  { title: 'SOAR', section: 'Security Operations', url: 'soar.html', keywords: 'soar automation playbook orchestration response' },
  { title: 'Threat Intelligence', section: 'Security Operations', url: 'threat-intel.html', keywords: 'threat intelligence tip stix taxii ioc' },
  { title: 'Incident Response', section: 'Security Operations', url: 'incident-response.html', keywords: 'incident response triage containment eradication' },
  { title: 'SOC Operating Models', section: 'Security Operations', url: 'soc-models.html', keywords: 'soc mssp hybrid in-house outsource' },
  { title: 'Security Metrics', section: 'Security Operations', url: 'security-metrics.html', keywords: 'metrics mttd mttr kpi reporting dashboard' },
  
  // Application Security
  { title: 'WAF Deep Dive', section: 'Application Security', url: 'waf-deep-dive.html', keywords: 'waf owasp rules bot management rate limiting' },
  { title: 'API Security', section: 'Application Security', url: 'api-security.html', keywords: 'api gateway oauth rate limiting validation' },
  { title: 'DevSecOps Pipeline', section: 'Application Security', url: 'devsecops.html', keywords: 'devsecops sast dast sca pipeline shift-left' },
  { title: 'Secrets Management', section: 'Application Security', url: 'secrets-management.html', keywords: 'secrets vault hashicorp dynamic rotation' },
  { title: 'Software Supply Chain', section: 'Application Security', url: 'supply-chain.html', keywords: 'supply chain sbom dependency signing provenance' },
  { title: 'Code Signing', section: 'Application Security', url: 'code-signing.html', keywords: 'code signing certificate verification' },
];

function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  
  if (!searchInput || !searchResults) return;
  
  let debounceTimer;
  
  searchInput.addEventListener('input', function(e) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = e.target.value.toLowerCase().trim();
      
      if (query.length < 2) {
        searchResults.classList.remove('active');
        return;
      }
      
      const results = searchIndex.filter(item => {
        return item.title.toLowerCase().includes(query) ||
               item.section.toLowerCase().includes(query) ||
               item.keywords.toLowerCase().includes(query);
      }).slice(0, 8);
      
      if (results.length > 0) {
        renderSearchResults(results, searchResults);
        searchResults.classList.add('active');
      } else {
        searchResults.innerHTML = '<div class="search-result-item"><div class="search-result-title">No results found</div></div>';
        searchResults.classList.add('active');
      }
    }, 150);
  });
  
  // Close search results when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-box')) {
      searchResults.classList.remove('active');
    }
  });
  
  // Keyboard shortcut (Ctrl/Cmd + K)
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
    
    // Escape to close
    if (e.key === 'Escape') {
      searchResults.classList.remove('active');
      searchInput.blur();
    }
  });
}

function renderSearchResults(results, container) {
  container.innerHTML = results.map(item => `
    <a href="${item.url}" class="search-result-item">
      <div class="search-result-title">${item.title}</div>
      <div class="search-result-section">${item.section}</div>
    </a>
  `).join('');
}

/* ---------- Collapsible Sections ---------- */
function initCollapsibles() {
  const collapsibles = document.querySelectorAll('.collapsible');
  
  collapsibles.forEach(collapsible => {
    const header = collapsible.querySelector('.collapsible-header');
    
    if (header) {
      header.addEventListener('click', function() {
        collapsible.classList.toggle('expanded');
      });
    }
  });
}

/* ---------- Comparison Tabs ---------- */
function initComparisonTabs() {
  const tabContainers = document.querySelectorAll('.comparison-container');
  
  tabContainers.forEach(container => {
    const tabs = container.querySelectorAll('.comparison-tab');
    const contents = container.querySelectorAll('.comparison-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const target = this.dataset.tab;
        
        // Remove active from all
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        
        // Add active to clicked
        this.classList.add('active');
        const targetContent = container.querySelector(`.comparison-content.${target}`);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  });
}

/* ---------- Copy to Clipboard ---------- */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-button');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', async function() {
      const codeBlock = this.closest('.code-block');
      const code = codeBlock.querySelector('code');
      
      if (code) {
        try {
          await navigator.clipboard.writeText(code.textContent);
          this.classList.add('copied');
          this.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
          
          setTimeout(() => {
            this.classList.remove('copied');
            this.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      }
    });
  });
}

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const sidebar = document.querySelector('.sidebar');
  
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      this.classList.toggle('active');
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 1024) {
        if (!e.target.closest('.sidebar') && !e.target.closest('.mobile-menu-btn')) {
          sidebar.classList.remove('open');
          menuBtn.classList.remove('active');
        }
      }
    });
  }
}

/* ---------- Scroll Spy ---------- */
function initScrollSpy() {
  const headings = document.querySelectorAll('h2[id], h3[id]');
  const tocLinks = document.querySelectorAll('.toc-link');
  
  if (headings.length === 0 || tocLinks.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.toc-link[href="#${entry.target.id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }, {
    rootMargin: '-20% 0px -80% 0px'
  });
  
  headings.forEach(heading => observer.observe(heading));
}

/* ---------- Smooth Scroll for Anchor Links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/* ---------- Diagram Interactivity ---------- */
function initDiagramInteractivity() {
  const diagramNodes = document.querySelectorAll('.diagram-node-interactive');
  
  diagramNodes.forEach(node => {
    node.addEventListener('click', function() {
      const info = this.dataset.info;
      if (info) {
        showDiagramTooltip(this, info);
      }
    });
  });
}

function showDiagramTooltip(element, content) {
  // Remove existing tooltip
  const existing = document.querySelector('.diagram-tooltip');
  if (existing) existing.remove();
  
  const tooltip = document.createElement('div');
  tooltip.className = 'diagram-tooltip';
  tooltip.innerHTML = content;
  
  const rect = element.getBoundingClientRect();
  tooltip.style.position = 'fixed';
  tooltip.style.top = `${rect.top - 10}px`;
  tooltip.style.left = `${rect.left + rect.width / 2}px`;
  tooltip.style.transform = 'translate(-50%, -100%)';
  
  document.body.appendChild(tooltip);
  
  setTimeout(() => tooltip.remove(), 3000);
}

/* ---------- Traffic Flow Animation ---------- */
function animateTrafficFlow(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const steps = container.querySelectorAll('.flow-vertical-step');
  let delay = 0;
  
  steps.forEach((step, index) => {
    step.style.opacity = '0';
    step.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
      step.style.transition = 'all 0.4s ease';
      step.style.opacity = '1';
      step.style.transform = 'translateX(0)';
    }, delay);
    
    delay += 200;
  });
}

/* ---------- Theme Toggle (Optional) ---------- */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;
  
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  themeBtn.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

/* ---------- Print Functionality ---------- */
function printPage() {
  window.print();
}

/* ---------- Export Functions for Global Use ---------- */
window.animateTrafficFlow = animateTrafficFlow;
window.printPage = printPage;
