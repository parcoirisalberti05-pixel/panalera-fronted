{displayItems.map((item) =>
            item.kind === 'group' ? (
              // @ts-ignore
              <ShoeCard
                key={item.key}
                variants={item.variants}
                onAddToCart={onAddToCart}
              />
            ) : (
              // @ts-ignore
              <ProductCard
                key={item.product.id}
                product={item.product}
                onAddToCart={onAddToCart}
              />
            )
          )}
        </div>
      ) : (
        <div className="py-16 text-center border-2 border-dashed border-rose-100 rounded-3xl flex flex-col items-center justify-center p-6 bg-white/50" id="empty-product-state">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-400 mb-4 shadow-sm">
            <FilterX className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-700">No encontramos productos</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Intentá buscando con otras palabras o borrando los filtros activos de búsqueda.
          </p>
          <button
            onClick={() => { setSearchQuery(''); onSelectCategory(null); }}
            className="cursor-pointer mt-4 px-6 py-2.5 text-xs font-bold bg-rose-400 hover:bg-rose-500 text-white rounded-full shadow-md shadow-rose-200 transition-all"
            id="clear-filters-btn"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
