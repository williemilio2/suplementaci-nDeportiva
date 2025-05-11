import Link from 'next/link';
import CustomCursor from '../components/customCursor';

export default function NotFound() {
    return (
      <div style={{width: "100vw", height:"100vh"}}>
        <CustomCursor/>
        <div style={{ padding: "2rem", textAlign: "center"}}>
          <h1>404 - Página no encontrada o en desarollo...</h1>
          <p>Lo sentimos, no pudimos encontrar lo que buscabas.</p>
          <Link href={'/'} className='hoverable'><button>Volver al inicio</button></Link>
        </div>
      </div>
    )
  }
  