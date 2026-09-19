                        onError: (cardFormError: unknown) => {
                            console.error('Mercado Pago CardForm error:', cardFormError)
                            setCardError('Verifique os dados do cartão e tente novamente.')
                        },
                        onSubmit: async (event: Event) => {
                            event.preventDefault()

                            const cardData = cardForm.getCardFormData()
                            const cardholderEmail = String(cardData.cardholderEmail || form.customerEmail || '').trim()

                            if (!cardData.token) {
                                setError('Não foi possível gerar o token do cartão. Verifique os dados informados.')
                                setLoading(false)
                                return
                            }

                            if (!cardholderEmail) {
                                setError('Informe o e-mail do comprador antes de continuar.')
                                setLoading(false)
                                return
                            }

                            try {
                                const paymentMethodType = form.paymentMethod === 'CREDIT_CARD'
                                    ? 'credit_card'
                                    : 'debit_card'

                                // The backend processes the card first. A local Açaívis
                                // order is created only when Mercado Pago returns an
                                // approved/processed payment.
                                const result = await api.createMercadoPagoCardCheckout({
                                    order: {
                                        customerName: form.customerName.trim(),
                                        customerPhone: onlyDigits(form.customerPhone),
                                        customerEmail: cardholderEmail,
                                        street: form.street.trim(),
                                        number: form.number.trim(),
                                        complement: form.complement.trim(),
                                        neighborhood: form.neighborhood.trim(),
                                        city: form.city.trim(),
                                        state: form.state.trim().toUpperCase(),
                                        zipCode: onlyDigits(form.zipCode),
                                        deliveryZoneId: deliveryQuote!.deliveryZoneId,
                                        paymentMethod: form.paymentMethod,
                                        notes: form.notes.trim(),
                                        items: items.map(item => ({
                                            productId: item.productId,
                                            quantity: item.quantity
                                        }))
                                    },
                                    payment: {
                                        paymentMethodId: cardData.paymentMethodId,
                                        paymentMethodType,
                                        token: cardData.token,
                                        installments: form.paymentMethod === 'DEBIT_CARD'
                                            ? 1
                                            : Number(cardData.installments || 1),
                                        payerEmail: cardholderEmail,
                                        idempotencyKey: uuid()
                                    }
                                })

                                setPayment(result.payment)

                                if (!result.order) {
                                    setError(
                                        result.payment.statusDetail
                                            ? 'Pagamento recusado pelo Mercado Pago. Tente outro cartão ou forma de pagamento.'
                                            : 'Não foi possível aprovar o pagamento. Tente novamente.'
                                    )
                                    return
                                }

                                setOrder(result.order)
                                clearCart()
                                navigate(`/resultado-pagamento?codigo=${encodeURIComponent(result.order.trackingCode)}`)
                            } catch (paymentError) {
                                setError(paymentError instanceof ApiError
                                    ? paymentError.message
                                    : 'Não foi possível processar o pagamento.')
                            } finally {
                                pendingCardOrderRef.current = null
                                setLoading(false)
                            }
                        }
                    }
                })
