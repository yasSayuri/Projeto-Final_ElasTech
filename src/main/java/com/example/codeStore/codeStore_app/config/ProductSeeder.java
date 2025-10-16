package com.example.codeStore.codeStore_app.config;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.codeStore.codeStore_app.enums.CategoriaProduto;
import com.example.codeStore.codeStore_app.model.Produto;
import com.example.codeStore.codeStore_app.repository.ProdutoRepository;

@Configuration
public class ProductSeeder {

  @Bean
  CommandLineRunner seedProdutos(ProdutoRepository repo) {
    return args -> {
      if (repo.count() > 0) return;

      List<Produto> produtos = new ArrayList<>();

      produtos.add(p("Computador Desktop Apple",    "Desktop Apple com ótimo desempenho", "49.90",  "COMPUTADORES"));
      produtos.add(p("Computador Desktop Intel Core","Desktop Intel Core custo/benefício", "45.90",  "COMPUTADORES"));
      produtos.add(p("Computador HP",                "Desktop HP para uso diário",         "39.90",  "COMPUTADORES"));
      produtos.add(p("Computador Samsung",           "Desktop Samsung confiável",          "42.90",  "COMPUTADORES"));
      produtos.add(p("Notebook Lenovo Slim",         "Notebook fino e leve Lenovo",        "52.90",  "NOTEBOOKS"));
      produtos.add(p("Notebook Windows 10",          "Notebook com Windows 10",            "48.90",  "NOTEBOOKS"));
      produtos.add(p("iPad Air 5ª Geração",          "Tablet iPad Air 5ª geração",         "29.90",  "TABLETS"));
      produtos.add(p("Tablet iPad 9ª Geração",       "iPad 9ª geração para estudos",       "59.90",  "TABLETS"));
      produtos.add(p("Smartphone Pixel 7",           "Google Pixel 7 com ótima câmera",    "64.90",  "SMARTPHONES"));
      produtos.add(p("Smartphone iPhone",            "iPhone com iOS atualizado",          "79.90",  "SMARTPHONES"));
      produtos.add(p("Teclado Mecânico RGB",         "Teclado gamer RGB mecânico",         "34.90",  "PERIFÉRICOS"));
      produtos.add(p("Headset Branco Sem Fio",       "Headset sem fio branco",             "49.90",  "PERIFÉRICOS"));
      produtos.add(p("Headset HyperX Preto",         "Headset HyperX som imersivo",        "54.90",  "PERIFÉRICOS"));
      produtos.add(p("Headset Gamer Redragon",       "Headset Redragon para jogos",        "59.90",  "PERIFÉRICOS"));
      produtos.add(p("iPhone 15 Roxo",               "iPhone 15 cor roxa",                 "99.90",  "SMARTPHONES"));
      produtos.add(p("Motorola G86 5G",              "Moto G86 com 5G",                    "89.90",  "SMARTPHONES"));
      produtos.add(p("Samsung Galaxy S23",           "Galaxy S23 topo de linha",           "79.90",  "SMARTPHONES"));
      produtos.add(p("iPhone azul",                  "iPhone cor azul",                    "69.90",  "SMARTPHONES"));
      produtos.add(p("Tablet Galaxy A9",             "Tablet Samsung Galaxy A9",           "69.90",  "TABLETS"));
      produtos.add(p("Lenovo Tab P11",               "Tablet Lenovo Tab P11",              "49.90",  "TABLETS"));
      produtos.add(p("Tablet Multilaser M9",         "Tablet Multilaser M9 básico",        "29.90",  "TABLETS"));
      produtos.add(p("Cooler T-Dagger RGB",          "Cooler T-Dagger com RGB",            "39.90",  "COMPONENTES"));
      produtos.add(p("Placa de Vídeo NVIDIA",        "GPU NVIDIA para jogos",              "129.90", "COMPONENTES"));
      produtos.add(p("SSD SanDisk 240GB",            "SSD SanDisk 240GB rápido",           "79.90",  "COMPONENTES"));
      produtos.add(p("SSD NVMe Kingston 500GB",      "SSD NVMe Kingston 500GB",            "99.90",  "COMPONENTES"));
      produtos.add(p("Mousepad Gamer RGB",           "Mousepad com iluminação RGB",        "29.90",  "ACESSÓRIOS"));
      produtos.add(p("Mousepad Preto Minimalista",   "Mousepad preto minimalista",         "19.90",  "ACESSÓRIOS"));
      produtos.add(p("Mousepad Estampa Roxa",        "Mousepad com estampa roxa",          "24.90",  "ACESSÓRIOS"));

      repo.saveAll(produtos);
    };
  }

  private static Produto p(String nome, String descricao, String precoStr, String catStr) {
    Produto pd = new Produto();
    pd.setNome(nome);
    pd.setDescricao(descricao);
    pd.setPreco(new BigDecimal(precoStr).setScale(2, RoundingMode.HALF_UP));
    pd.setCategoriaProduto(mapCategoria(catStr));
    return pd;
  }

  private static CategoriaProduto mapCategoria(String s) {
    String key = normalize(s);
    if (key.equals("ACESSORIOS"))   return CategoriaProduto.ACESSÓRIOS;
    if (key.equals("PERIFERICOS"))  return CategoriaProduto.PERIFÉRICOS;
    try { return CategoriaProduto.valueOf(key); }
    catch (IllegalArgumentException e) { return CategoriaProduto.OUTROS; }
  }

  private static String normalize(String s) {
    String up = s == null ? "" : s.trim().toUpperCase(Locale.ROOT);
    return Normalizer.normalize(up, Normalizer.Form.NFD)
        .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
  }
}
