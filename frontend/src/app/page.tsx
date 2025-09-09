export default function Home() {
  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div style={{textAlign: 'center', color: 'white', padding: '2rem'}}>
        <h1 style={{fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold'}}>
          CapitalLeaf
        </h1>
        <p style={{fontSize: '1.2rem', marginBottom: '2rem'}}>
          Dynamic Defense with Microservice Isolation
        </p>
        <div style={{background: 'rgba(255, 255, 255, 0.1)', padding: '1.5rem', borderRadius: '8px', backdropFilter: 'blur(10px)'}}>
          <h2 style={{fontSize: '1.5rem', marginBottom: '1rem'}}>Features</h2>
          <ul style={{listStyle: 'none', padding: 0}}>
            <li style={{marginBottom: '0.5rem'}}>🔐 Multi-Factor Authentication</li>
            <li style={{marginBottom: '0.5rem'}}>🛡️ Rate Limiting</li>
            <li style={{marginBottom: '0.5rem'}}>🔒 Input Validation</li>
            <li style={{marginBottom: '0.5rem'}}>📊 Risk Assessment</li>
            <li style={{marginBottom: '0.5rem'}}>🚀 Secure Deployment</li>
          </ul>
        </div>
      </div>
    </div>
  );
}