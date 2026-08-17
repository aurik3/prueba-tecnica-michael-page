export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "AMM Solicitudes de Compra API",
    version: "1.0.0",
    description: "API REST para flujo de solicitudes de compra, aprobación por OTP y evidencia PDF"
  },
  servers: [
    {
      url: "http://localhost:4000/api"
    }
  ],
  tags: [
    {
      name: "Requests"
    },
    {
      name: "Approvals"
    }
  ],
  paths: {
    "/solicitudes": {
      post: {
        tags: ["Requests"],
        summary: "Crear solicitud de compra",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateRequestInput"
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Solicitud creada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RequestResponse"
                }
              }
            }
          },
          "400": {
            $ref: "#/components/responses/ValidationError"
          }
        }
      },
      get: {
        tags: ["Requests"],
        summary: "Listar solicitudes",
        responses: {
          "200": {
            description: "Listado de solicitudes",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true
                    },
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/PurchaseRequest"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/solicitudes/{id}": {
      get: {
        tags: ["Requests"],
        summary: "Consultar detalle de solicitud",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid"
            }
          }
        ],
        responses: {
          "200": {
            description: "Detalle de solicitud",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RequestResponse"
                }
              }
            }
          },
          "404": {
            $ref: "#/components/responses/NotFound"
          }
        }
      }
    },
    "/solicitudes/{id}/evidencia.pdf": {
      get: {
        tags: ["Requests"],
        summary: "Descargar PDF de evidencia",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid"
            }
          }
        ],
        responses: {
          "200": {
            description: "Archivo PDF",
            content: {
              "application/pdf": {
                schema: {
                  type: "string",
                  format: "binary"
                }
              }
            }
          },
          "404": {
            $ref: "#/components/responses/NotFound"
          }
        }
      }
    },
    "/aprobaciones/{token}": {
      get: {
        tags: ["Approvals"],
        summary: "Consultar aprobación por token",
        parameters: [
          {
            $ref: "#/components/parameters/ApprovalToken"
          }
        ],
        responses: {
          "200": {
            description: "Detalle de aprobación",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApprovalResponse"
                }
              }
            }
          },
          "404": {
            $ref: "#/components/responses/NotFound"
          }
        }
      }
    },
    "/aprobaciones/{token}/request-otp": {
      post: {
        tags: ["Approvals"],
        summary: "Solicitar OTP de aprobación",
        parameters: [
          {
            $ref: "#/components/parameters/ApprovalToken"
          }
        ],
        responses: {
          "200": {
            description: "OTP generado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true
                    },
                    data: {
                      type: "object",
                      properties: {
                        expiresAt: {
                          type: "string",
                          format: "date-time"
                        },
                        delivery: {
                          type: "string",
                          example: "simulated"
                        },
                        code: {
                          type: "string",
                          example: "123456"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "409": {
            $ref: "#/components/responses/Conflict"
          }
        }
      }
    },
    "/aprobaciones/{token}/verify-otp": {
      post: {
        tags: ["Approvals"],
        summary: "Validar OTP",
        parameters: [
          {
            $ref: "#/components/parameters/ApprovalToken"
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["code"],
                properties: {
                  code: {
                    type: "string",
                    example: "123456"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OTP validado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true
                    },
                    data: {
                      type: "object",
                      properties: {
                        validatedUntil: {
                          type: "string",
                          format: "date-time"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            $ref: "#/components/responses/Unauthorized"
          }
        }
      }
    },
    "/aprobaciones/{token}/approve": {
      post: {
        tags: ["Approvals"],
        summary: "Aprobar solicitud",
        parameters: [
          {
            $ref: "#/components/parameters/ApprovalToken"
          }
        ],
        responses: {
          "200": {
            description: "Solicitud aprobada por el aprobador",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RequestResponse"
                }
              }
            }
          },
          "401": {
            $ref: "#/components/responses/Unauthorized"
          },
          "409": {
            $ref: "#/components/responses/Conflict"
          }
        }
      }
    },
    "/aprobaciones/{token}/reject": {
      post: {
        tags: ["Approvals"],
        summary: "Rechazar solicitud",
        parameters: [
          {
            $ref: "#/components/parameters/ApprovalToken"
          }
        ],
        responses: {
          "200": {
            description: "Solicitud rechazada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RequestResponse"
                }
              }
            }
          },
          "401": {
            $ref: "#/components/responses/Unauthorized"
          },
          "409": {
            $ref: "#/components/responses/Conflict"
          }
        }
      }
    }
  },
  components: {
    parameters: {
      ApprovalToken: {
        name: "token",
        in: "path",
        required: true,
        schema: {
          type: "string",
          format: "uuid"
        }
      }
    },
    schemas: {
      CreateRequestInput: {
        type: "object",
        required: ["titulo", "descripcion", "monto", "solicitante", "aprobadores"],
        properties: {
          titulo: {
            type: "string",
            example: "Compra de licencias"
          },
          descripcion: {
            type: "string",
            example: "Licencias anuales para el equipo operativo"
          },
          monto: {
            type: "number",
            example: 12500000
          },
          solicitante: {
            type: "string",
            example: "Laura Gomez"
          },
          aprobadores: {
            type: "array",
            minItems: 3,
            maxItems: 3,
            items: {
              type: "object",
              required: ["nombre", "email"],
              properties: {
                nombre: {
                  type: "string",
                  example: "Carlos Ruiz"
                },
                email: {
                  type: "string",
                  format: "email",
                  example: "carlos@example.com"
                }
              }
            }
          }
        }
      },
      PurchaseRequest: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid"
          },
          titulo: {
            type: "string"
          },
          descripcion: {
            type: "string"
          },
          monto: {
            type: "number"
          },
          solicitante: {
            type: "string"
          },
          estado: {
            type: "string",
            enum: ["PENDING", "REJECTED", "COMPLETED"]
          },
          evidenciaUrl: {
            type: "string",
            nullable: true
          },
          aprobadores: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Approver"
            }
          }
        }
      },
      Approver: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid"
          },
          nombre: {
            type: "string"
          },
          email: {
            type: "string"
          },
          estado: {
            type: "string",
            enum: ["PENDING", "SIGNED", "REJECTED"]
          },
          signedAt: {
            type: "string",
            nullable: true,
            format: "date-time"
          },
          rejectedAt: {
            type: "string",
            nullable: true,
            format: "date-time"
          },
          enlaceAprobacion: {
            type: "string"
          }
        }
      },
      ApprovalResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true
          },
          data: {
            type: "object"
          }
        }
      },
      RequestResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true
          },
          data: {
            $ref: "#/components/schemas/PurchaseRequest"
          }
        }
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false
          },
          message: {
            type: "string"
          },
          code: {
            type: "string"
          },
          details: {
            nullable: true
          }
        }
      }
    },
    responses: {
      ValidationError: {
        description: "Error de validación",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse"
            }
          }
        }
      },
      Unauthorized: {
        description: "No autorizado",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse"
            }
          }
        }
      },
      NotFound: {
        description: "No encontrado",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse"
            }
          }
        }
      },
      Conflict: {
        description: "Conflicto de estado",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse"
            }
          }
        }
      }
    }
  }
};
