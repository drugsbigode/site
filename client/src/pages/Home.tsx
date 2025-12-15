import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Home() {
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    trabalha: "",
    discordId: "",
    recrutador: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const submitMutation = trpc.recruitment.submit.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, trabalha: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.nome.trim()) {
      toast.error("Por favor, insira seu nome no Roblox");
      return false;
    }
    if (!formData.idade.trim()) {
      toast.error("Por favor, insira sua idade");
      return false;
    }
    if (!formData.trabalha) {
      toast.error("Por favor, selecione se trabalha ou não");
      return false;
    }
    if (!formData.discordId.trim()) {
      toast.error("Por favor, insira seu ID do Discord");
      return false;
    }
    if (!formData.recrutador.trim()) {
      toast.error("Por favor, insira quem te recrutou");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await submitMutation.mutateAsync({
        nome: formData.nome,
        idade: parseInt(formData.idade),
        trabalha: formData.trabalha === "sim",
        discordId: formData.discordId,
        recrutador: formData.recrutador,
      });

      setShowSuccess(true);
      setFormData({ nome: "", idade: "", trabalha: "", discordId: "", recrutador: "" });

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      toast.error("Erro ao enviar formulário. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header com Logo */}
      <header className="border-b border-border py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
          <img
            src="/logo-os-raul.png"
            alt="Os Raul Logo"
            className="h-32 w-auto object-contain"
          />
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">OS RAUL</h1>
            <p className="text-muted-foreground text-lg">Recrutamento</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-2xl bg-card border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-2xl">Formulário de Inscrição</CardTitle>
            <CardDescription className="text-muted-foreground">
              Preencha todos os campos abaixo para se inscrever no grupo
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {showSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <CheckCircle className="h-16 w-16 text-accent animate-pulse" />
                <h2 className="text-2xl font-bold text-center">Inscrição Enviada!</h2>
                <p className="text-muted-foreground text-center">
                  Aguarde sua aprovação no Discord
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-foreground font-semibold">
                    Nome (no Roblox) *
                  </Label>
                  <Input
                    id="nome"
                    name="nome"
                    type="text"
                    placeholder="Seu nome no Roblox"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Idade */}
                <div className="space-y-2">
                  <Label htmlFor="idade" className="text-foreground font-semibold">
                    Idade *
                  </Label>
                  <Input
                    id="idade"
                    name="idade"
                    type="number"
                    placeholder="Sua idade"
                    value={formData.idade}
                    onChange={handleInputChange}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Trabalha */}
                <div className="space-y-2">
                  <Label htmlFor="trabalha" className="text-foreground font-semibold">
                    Trabalha? *
                  </Label>
                  <Select value={formData.trabalha} onValueChange={handleSelectChange} disabled={isSubmitting}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="sim" className="text-foreground">
                        Sim
                      </SelectItem>
                      <SelectItem value="nao" className="text-foreground">
                        Não
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* ID do Discord */}
                <div className="space-y-2">
                  <Label htmlFor="discordId" className="text-foreground font-semibold">
                    ID do Discord *
                  </Label>
                  <Input
                    id="discordId"
                    name="discordId"
                    type="text"
                    placeholder="Seu ID do Discord (números)"
                    value={formData.discordId}
                    onChange={handleInputChange}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Quem te recrutou */}
                <div className="space-y-2">
                  <Label htmlFor="recrutador" className="text-foreground font-semibold">
                    Quem te recrutou? *
                  </Label>
                  <Input
                    id="recrutador"
                    name="recrutador"
                    type="text"
                    placeholder="Nome de quem te recrutou"
                    value={formData.recrutador}
                    onChange={handleInputChange}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold py-3 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Inscrição"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  * Todos os campos são obrigatórios
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4 text-center text-muted-foreground">
        <p>© 2025 Os Raul. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
