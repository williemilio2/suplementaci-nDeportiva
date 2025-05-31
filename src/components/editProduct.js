import React, { useEffect, useState, useRef } from "react";
import styles from '@/src/styles/editProduct.module.css';
import { sacarStockSeguro } from "@/src/products/listaArchivos"

export default function EditModal({ isOpen, onClose, producto }) {
  const [insignia, setInsignia] = useState("");
  const [categorias, setCategorias] = useState("");
  const [superOferta, setSuperOferta] = useState(false); // NUEVO: estado para checkbox
  const [rebajasElite, setRebajasElite] = useState(false); // NUEVO: estado para checkbox
  const [quitarRebajasElite, setQuitarRebajasElite] = useState(false); // NUEVO: estado para checkbox

  const [sabores, setSabores] = useState([]);
  const [selectedSabor, setSelectedSabor] = useState("");
  const [nuevoSabor, setNuevoSabor] = useState("");

  const [selectedTamano, setSelectedTamano] = useState("");
  const [preciosOfertas, setPreciosOfertas] = useState(0);
  const [cantidad, setCantidad] = useState(0);
  const [precios, setPrecios] = useState(0);
  const retryCount = useRef(0);
  const timeoutRef = useRef(null);
  const maxRetries = 3;
  useEffect(() => {
    const loadProductData = async () => {
      try {
        const stock = await sacarStockSeguro(producto);
        retryCount.current = 0;
        const sabores = stock.map(item => item.sabor);
        const saboresUnicos = [...new Set(sabores)];
        setSabores(saboresUnicos)
      } catch (error) {
        console.error("Error al cargar datos del producto:", error);

        if (retryCount.current < maxRetries) {
          retryCount.current++;
          const retryDelay = Math.min(1000 * Math.pow(2, retryCount.current), 10000);
          timeoutRef.current = setTimeout(loadProductData, retryDelay);
        }
      }
    };

    loadProductData();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [producto]);
if (!isOpen) return null;
  const addNuevoSabor = () => {
    const nuevo = nuevoSabor.trim();
    if (!nuevo || sabores.includes(nuevo)) return;

    setSabores([...sabores, nuevo]);
    setSelectedSabor(nuevo);

    setNuevoSabor("");
    setSelectedTamano("");
  };

 const handleSubmit = async () => {
    const data = {
      insignia,
      categorias: categorias,
      superOferta,
      selectedSabor,
      selectedTamano,
      preciosOfertas,
      precios,
      producto,
      cantidad,
      rebajasElite,
      quitarRebajasElite
    };
    console.log(data)
    try {
      const res = await fetch('/api/editData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Error al guardar el producto');

      const json = await res.json();
      alert(json.message);
      onClose();
      window.location.reload(true)

    } catch (error) {
      alert(error.message);
    }
  };


  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Editar producto</h2>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Información general</h3>
          <div className={styles.formGroup}>
            <label htmlFor="insignia">Insignia</label>
            <input className={styles.input} value={insignia} onChange={e => setInsignia(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="categorias">Categorías especiales</label>
            <input className={styles.input} value={categorias} onChange={e => setCategorias(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="superOferta">Super ofertas</label>
            <input
              type="checkbox"
              className={styles.checkBox}
              checked={superOferta}
              onChange={e => setSuperOferta(e.target.checked)}
            />
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Sabores existentes</h3>
          <div className={styles.selectMultiple}>
            {sabores.map(sabor => (
              <button
                key={sabor}
                type="button"
                className={`${styles.button} ${selectedSabor === sabor ? styles.selectedButton : ""}`}
                onClick={() => setSelectedSabor(sabor)}
              >
                {sabor}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Precios y ofertas</h3>
          <div className={styles.formGroup}>
            <label htmlFor="tamano">Tamaño</label>
            <input
              className={styles.input}
              placeholder="Introduce el tamaño"
              value={selectedTamano}
              onChange={e => setSelectedTamano(e.target.value)}
            />
          </div>
          <p>Quitar oferta elite</p>       
          <input
            type="checkbox"
            className={styles.checkBox}
            checked={quitarRebajasElite}
            onChange={e => setQuitarRebajasElite(e.target.checked)}
          />
          {selectedSabor && selectedTamano && (
            <>
              <div className={styles.formGroup}>
                <label>Precio</label>
                <input className={styles.input} onChange={e => setPrecios(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Oferta (%)</label>
                <input className={styles.input} onChange={e => setPreciosOfertas(e.target.value)} />     
                <p>Oferta elite</p>       
                <input
                  type="checkbox"
                  className={styles.checkBox}
                  checked={rebajasElite}
                  onChange={e => setRebajasElite(e.target.checked)}
                />                
              </div>
              <div className={styles.formGroup}>
                <label>Cantidad</label>
                <input className={styles.input} onChange={e => setCantidad(e.target.value)} placeholder="SOLO PONER ESTO PARA ARTICULOS NUEVOS"/>
              </div>
            </>
          )}
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Añadir nuevo sabor</h3>
          <input
            className={styles.input}
            placeholder="Nombre del nuevo sabor"
            value={nuevoSabor}
            onChange={e => setNuevoSabor(e.target.value)}
          />
          <div className={styles.selectMultiple}>
            {/* Aquí podrías agregar botones si decides reactivar la lógica de selección de tamaños para nuevos sabores */}
          </div>
          <button className={styles.addButton} onClick={addNuevoSabor}>Añadir sabor</button>
        </section>

        <div className={styles.modalActions}>
          <button className={`${styles.button} ${styles.cancelButton}`} onClick={onClose}>Cancelar</button>
          <button className={`${styles.button} ${styles.saveButton}`} onClick={handleSubmit}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
