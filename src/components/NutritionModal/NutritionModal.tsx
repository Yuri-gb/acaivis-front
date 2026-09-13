import { useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import type { MockProduct } from '../../dev/mockProduct'
import './NutritionModal.css'

interface NutritionModalProps {
    isOpen: boolean
    onClose: () => void
    product: MockProduct
}

function NutritionModal({
    isOpen,
    onClose,
    product
}: NutritionModalProps) {
    useEffect(() => {
        if (!isOpen) {
            return
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEscape)
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = ''
        }
    }, [isOpen, onClose])

    if (!isOpen) {
        return null
    }

    return (
        <div
            className="nutrition-modal-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose()
                }
            }}
        >
            <div
                className="nutrition-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="nutrition-modal-title"
            >
                <div className="nutrition-modal-header">
                    <div>
                        <span className="nutrition-modal-eyebrow">
                            Informações do produto
                        </span>

                        <h2 id="nutrition-modal-title">
                            Tabela nutricional
                        </h2>

                        <p>{product.name}</p>
                    </div>

                    <button
                        type="button"
                        className="nutrition-modal-close"
                        onClick={onClose}
                        aria-label="Fechar tabela nutricional"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="nutrition-modal-content">
                    <div className="nutrition-modal-table-wrapper">
                        <table className="nutrition-modal-table">
                            <thead>
                                <tr>
                                    <th>Nutriente</th>
                                    <th>Porção</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>Valor energético</td>
                                    <td>120 kcal</td>
                                </tr>
                                <tr>
                                    <td>Carboidratos</td>
                                    <td>28 g</td>
                                </tr>
                                <tr>
                                    <td>Proteínas</td>
                                    <td>1,5 g</td>
                                </tr>
                                <tr>
                                    <td>Gorduras trans</td>
                                    <td>0 g</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NutritionModal
